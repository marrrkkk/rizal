<?php
// api/progress/complete_level.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: false");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt.php';

// Verify JWT token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
  http_response_code(401);
  echo json_encode(['error' => 'Authorization token required']);
  exit;
}

$jwt = $matches[1];
$username = validateJWT($jwt);

if (!$username) {
  http_response_code(401);
  echo json_encode(['error' => 'Invalid token']);
  exit;
}

// Get user ID
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
  http_response_code(404);
  echo json_encode(['error' => 'User not found']);
  exit;
}

$userId = $user['id'];

// Get request data
$data = json_decode(file_get_contents('php://input'), true);
$chapterId = (int)($data['chapter'] ?? 0);
$levelId = (int)($data['level'] ?? 0);
$score = (int)($data['score'] ?? 0);

if ($chapterId < 1 || $chapterId > 6 || $levelId < 1 || $levelId > 5) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid chapter or level']);
  exit;
}

try {
  $pdo->beginTransaction();

  // Check if level is unlocked
  $stmt = $pdo->prepare('
        SELECT is_unlocked, is_completed, score 
        FROM user_progress 
        WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    ');
  $stmt->execute([$userId, $chapterId, $levelId]);
  $currentProgress = $stmt->fetch();

  if (!$currentProgress || !$currentProgress['is_unlocked']) {
    $pdo->rollBack();
    http_response_code(403);
    echo json_encode(['error' => 'Level is not unlocked']);
    exit;
  }

  $isFirstCompletion = !$currentProgress['is_completed'];
  $previousScore = (int)($currentProgress['score'] ?? 0);
  $newScore = max($previousScore, $score);

  // Update level completion
  $stmt = $pdo->prepare('
        UPDATE user_progress 
        SET is_completed = 1, score = ?, completion_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    ');
  $stmt->execute([$newScore, $userId, $chapterId, $levelId]);

  $newBadges = [];

  // Unlock next level in same chapter
  $nextLevel = $levelId + 1;
  if ($nextLevel <= 5) {
    $stmt = $pdo->prepare('
            INSERT OR REPLACE INTO user_progress (user_id, chapter_id, level_id, is_unlocked, updated_at)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
        ');
    $stmt->execute([$userId, $chapterId, $nextLevel]);
  }

  // Check if chapter is complete and unlock next chapter
  $stmt = $pdo->prepare('
        SELECT COUNT(*) as completed_count
        FROM user_progress 
        WHERE user_id = ? AND chapter_id = ? AND is_completed = 1
    ');
  $stmt->execute([$userId, $chapterId]);
  $completedInChapter = $stmt->fetch()['completed_count'];

  $chapterComplete = false;
  if ($completedInChapter >= 5) {
    $chapterComplete = true;

    // Award chapter completion badge
    $badgeType = "chapter_{$chapterId}_complete";
    $badgeName = "Chapter {$chapterId} Master";

    $stmt = $pdo->prepare('
            INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name)
            VALUES (?, ?, ?)
        ');
    if ($stmt->execute([$userId, $badgeType, $badgeName])) {
      if ($stmt->rowCount() > 0) {
        $newBadges[] = $badgeType;
      }
    }

    // Unlock first level of next chapter
    $nextChapter = $chapterId + 1;
    if ($nextChapter <= 6) {
      $stmt = $pdo->prepare('
                INSERT OR REPLACE INTO user_progress (user_id, chapter_id, level_id, is_unlocked, updated_at)
                VALUES (?, ?, 1, 1, CURRENT_TIMESTAMP)
            ');
      $stmt->execute([$userId, $nextChapter]);
    }
  }

  // Award other badges
  if ($isFirstCompletion) {
    // First level completion badge
    $stmt = $pdo->prepare('SELECT COUNT(*) as total FROM user_progress WHERE user_id = ? AND is_completed = 1');
    $stmt->execute([$userId]);
    $totalCompleted = $stmt->fetch()['total'];

    if ($totalCompleted == 1) {
      $stmt = $pdo->prepare('
                INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name)
                VALUES (?, "first_level_complete", "First Steps")
            ');
      if ($stmt->execute([$userId]) && $stmt->rowCount() > 0) {
        $newBadges[] = "first_level_complete";
      }
    }

    // Perfect score badge
    if ($score >= 100) {
      $stmt = $pdo->prepare('
                INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name)
                VALUES (?, "perfect_score", "Perfect Scholar")
            ');
      if ($stmt->execute([$userId]) && $stmt->rowCount() > 0) {
        $newBadges[] = "perfect_score";
      }
    }

    // Knowledge seeker badge (10 levels)
    if ($totalCompleted >= 10) {
      $stmt = $pdo->prepare('
                INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name)
                VALUES (?, "knowledge_seeker", "Knowledge Seeker")
            ');
      if ($stmt->execute([$userId]) && $stmt->rowCount() > 0) {
        $newBadges[] = "knowledge_seeker";
      }
    }

    // Rizal expert badge (all chapters complete)
    $stmt = $pdo->prepare('
            SELECT COUNT(*) as total_completed
            FROM user_progress 
            WHERE user_id = ? AND is_completed = 1
        ');
    $stmt->execute([$userId]);
    $totalCompleted = $stmt->fetch()['total_completed'];

    if ($totalCompleted >= 30) {
      $stmt = $pdo->prepare('
                INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name)
                VALUES (?, "rizal_expert", "Rizal Expert")
            ');
      if ($stmt->execute([$userId]) && $stmt->rowCount() > 0) {
        $newBadges[] = "rizal_expert";
      }
    }
  }

  // Update user statistics
  $stmt = $pdo->prepare('
        SELECT 
            COUNT(*) as total_completed,
            AVG(score) as avg_score,
            SUM(score) as total_score
        FROM user_progress 
        WHERE user_id = ? AND is_completed = 1
    ');
  $stmt->execute([$userId]);
  $stats = $stmt->fetch();

  $stmt = $pdo->prepare('
        INSERT OR REPLACE INTO user_statistics (user_id, total_levels_completed, total_score, average_score, last_played_date, updated_at)
        VALUES (?, ?, ?, ?, DATE("now"), CURRENT_TIMESTAMP)
    ');
  $stmt->execute([
    $userId,
    (int)$stats['total_completed'],
    (int)$stats['total_score'],
    round((float)$stats['avg_score'], 2)
  ]);

  $pdo->commit();

  // Return success response
  echo json_encode([
    'success' => true,
    'message' => 'Level completed successfully',
    'newBadges' => $newBadges,
    'chapterComplete' => $chapterComplete,
    'nextLevelUnlocked' => $nextLevel <= 5 ? ['chapter' => $chapterId, 'level' => $nextLevel] : null,
    'nextChapterUnlocked' => ($chapterComplete && $chapterId < 6) ? ['chapter' => $chapterId + 1, 'level' => 1] : null
  ]);
} catch (Exception $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['error' => 'Failed to complete level: ' . $e->getMessage()]);
}
