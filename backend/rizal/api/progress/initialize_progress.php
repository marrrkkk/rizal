<?php
// api/progress/initialize_progress.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
  $pdo->beginTransaction();

  // Check if user already has progress
  $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?');
  $stmt->execute([$userId]);
  $hasProgress = $stmt->fetch()['count'] > 0;

  if (!$hasProgress) {
    // Initialize Chapter 1, Level 1 as unlocked
    $stmt = $pdo->prepare('
            INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
            VALUES (?, 1, 1, TRUE)
        ');
    $stmt->execute([$userId]);

    // Initialize user statistics
    $stmt = $pdo->prepare('
            INSERT IGNORE INTO user_statistics (user_id)
            VALUES (?)
        ');
    $stmt->execute([$userId]);
  }

  $pdo->commit();

  echo json_encode([
    'success' => true,
    'message' => 'Progress initialized successfully',
    'wasAlreadyInitialized' => $hasProgress
  ]);
} catch (Exception $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['error' => 'Failed to initialize progress: ' . $e->getMessage()]);
}
