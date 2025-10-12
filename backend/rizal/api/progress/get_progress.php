<?php
// api/progress/get_progress.php
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

try {
  // Get all progress for the user
  $stmt = $pdo->prepare('
        SELECT chapter_id, level_id, is_unlocked, is_completed, score, completion_date
        FROM user_progress 
        WHERE user_id = ? 
        ORDER BY chapter_id, level_id
    ');
  $stmt->execute([$userId]);
  $progress = $stmt->fetchAll();

  // Get user badges
  $stmt = $pdo->prepare('
        SELECT badge_type, badge_name, earned_date
        FROM user_badges 
        WHERE user_id = ?
        ORDER BY earned_date DESC
    ');
  $stmt->execute([$userId]);
  $badges = $stmt->fetchAll();

  // Get user statistics
  $stmt = $pdo->prepare('
        SELECT total_levels_completed, total_score, average_score, 
               current_streak, longest_streak, last_played_date
        FROM user_statistics 
        WHERE user_id = ?
    ');
  $stmt->execute([$userId]);
  $stats = $stmt->fetch();

  // Organize progress by chapters
  $chapters = [];
  foreach ($progress as $p) {
    $chapterId = $p['chapter_id'];
    if (!isset($chapters[$chapterId])) {
      $chapters[$chapterId] = [
        'unlockedLevels' => [],
        'completedLevels' => [],
        'scores' => [],
        'badges' => []
      ];
    }

    if ($p['is_unlocked']) {
      $chapters[$chapterId]['unlockedLevels'][] = (int)$p['level_id'];
    }

    if ($p['is_completed']) {
      $chapters[$chapterId]['completedLevels'][] = (int)$p['level_id'];
      $chapters[$chapterId]['scores'][$p['level_id']] = (int)$p['score'];
    }
  }

  // Ensure all chapters exist in response
  for ($i = 1; $i <= 6; $i++) {
    if (!isset($chapters[$i])) {
      $chapters[$i] = [
        'unlockedLevels' => [],
        'completedLevels' => [],
        'scores' => [],
        'badges' => []
      ];
    }
  }

  $response = [
    'chapters' => $chapters,
    'overall' => [
      'totalLevels' => 30, // 6 chapters × 5 levels
      'completedLevels' => (int)($stats['total_levels_completed'] ?? 0),
      'averageScore' => (float)($stats['average_score'] ?? 0),
      'badges' => array_column($badges, 'badge_type'),
      'lastPlayed' => $stats['last_played_date'] ?? null,
      'currentStreak' => (int)($stats['current_streak'] ?? 0),
      'longestStreak' => (int)($stats['longest_streak'] ?? 0)
    ],
    'badges' => $badges
  ];

  echo json_encode($response);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to fetch progress: ' . $e->getMessage()]);
}
