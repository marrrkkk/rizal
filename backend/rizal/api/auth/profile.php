<?php
// api/auth/profile.php - Get detailed user profile information
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

try {
  // Get user information
  $stmt = $pdo->prepare('SELECT id, username, created_at FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();

  if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
  }

  $userId = $user['id'];

  // Get progress statistics
  $stmt = $pdo->prepare('
        SELECT 
            COUNT(*) as total_levels,
            SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_levels,
            SUM(CASE WHEN is_unlocked = 1 THEN 1 ELSE 0 END) as unlocked_levels,
            AVG(CASE WHEN is_completed = 1 THEN score ELSE NULL END) as average_score
        FROM user_progress 
        WHERE user_id = ?
    ');
  $stmt->execute([$userId]);
  $progressStats = $stmt->fetch();

  // Get chapter progress
  $stmt = $pdo->prepare('
        SELECT 
            chapter_id,
            COUNT(*) as total_levels,
            SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_levels,
            SUM(CASE WHEN is_unlocked = 1 THEN 1 ELSE 0 END) as unlocked_levels
        FROM user_progress 
        WHERE user_id = ?
        GROUP BY chapter_id
        ORDER BY chapter_id
    ');
  $stmt->execute([$userId]);
  $chapterProgress = $stmt->fetchAll();

  // Get badges
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

  // Calculate completion percentage
  $totalPossibleLevels = 30; // 6 chapters × 5 levels
  $completionPercentage = $progressStats['completed_levels'] > 0
    ? round(($progressStats['completed_levels'] / $totalPossibleLevels) * 100, 1)
    : 0;

  $response = [
    'user' => [
      'id' => $user['id'],
      'username' => $user['username'],
      'created_at' => $user['created_at'],
      'member_since' => date('F j, Y', strtotime($user['created_at']))
    ],
    'progress' => [
      'total_levels' => (int)($progressStats['total_levels'] ?? 0),
      'completed_levels' => (int)($progressStats['completed_levels'] ?? 0),
      'unlocked_levels' => (int)($progressStats['unlocked_levels'] ?? 0),
      'completion_percentage' => $completionPercentage,
      'average_score' => round((float)($progressStats['average_score'] ?? 0), 1)
    ],
    'chapters' => array_map(function ($chapter) {
      return [
        'chapter_id' => (int)$chapter['chapter_id'],
        'total_levels' => (int)$chapter['total_levels'],
        'completed_levels' => (int)$chapter['completed_levels'],
        'unlocked_levels' => (int)$chapter['unlocked_levels'],
        'completion_percentage' => $chapter['total_levels'] > 0
          ? round(($chapter['completed_levels'] / $chapter['total_levels']) * 100, 1)
          : 0
      ];
    }, $chapterProgress),
    'badges' => array_map(function ($badge) {
      return [
        'type' => $badge['badge_type'],
        'name' => $badge['badge_name'],
        'earned_date' => $badge['earned_date'],
        'earned_ago' => time_ago($badge['earned_date'])
      ];
    }, $badges),
    'statistics' => [
      'total_score' => (int)($stats['total_score'] ?? 0),
      'current_streak' => (int)($stats['current_streak'] ?? 0),
      'longest_streak' => (int)($stats['longest_streak'] ?? 0),
      'last_played' => $stats['last_played_date'] ?? null,
      'last_played_ago' => $stats['last_played_date'] ? time_ago($stats['last_played_date']) : null
    ]
  ];

  echo json_encode($response);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to fetch profile: ' . $e->getMessage()]);
}

function time_ago($datetime)
{
  $time = time() - strtotime($datetime);

  if ($time < 60) return 'just now';
  if ($time < 3600) return floor($time / 60) . ' minutes ago';
  if ($time < 86400) return floor($time / 3600) . ' hours ago';
  if ($time < 2592000) return floor($time / 86400) . ' days ago';
  if ($time < 31536000) return floor($time / 2592000) . ' months ago';
  return floor($time / 31536000) . ' years ago';
}
