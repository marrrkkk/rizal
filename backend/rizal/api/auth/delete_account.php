<?php
// api/auth/delete_account.php - Delete user account and all associated data
header("Access-Control-Allow-Origin: *");
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

// Get request data
$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';
$confirmation = $data['confirmation'] ?? '';

if (!$password) {
  http_response_code(400);
  echo json_encode(['error' => 'Password required for account deletion']);
  exit;
}

if ($confirmation !== 'DELETE') {
  http_response_code(400);
  echo json_encode(['error' => 'Please type DELETE to confirm account deletion']);
  exit;
}

try {
  $pdo->beginTransaction();

  // Get user information
  $stmt = $pdo->prepare('SELECT id, password FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();

  if (!$user) {
    $pdo->rollBack();
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
  }

  // Verify password
  if (!password_verify($password, $user['password'])) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => 'Incorrect password']);
    exit;
  }

  $userId = $user['id'];

  // Delete all user data (foreign key constraints will handle cascading)
  // But let's be explicit for clarity

  // Delete user progress
  $stmt = $pdo->prepare('DELETE FROM user_progress WHERE user_id = ?');
  $stmt->execute([$userId]);

  // Delete user badges
  $stmt = $pdo->prepare('DELETE FROM user_badges WHERE user_id = ?');
  $stmt->execute([$userId]);

  // Delete user statistics
  $stmt = $pdo->prepare('DELETE FROM user_statistics WHERE user_id = ?');
  $stmt->execute([$userId]);

  // Delete user account
  $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
  $stmt->execute([$userId]);

  $pdo->commit();

  echo json_encode([
    'success' => true,
    'message' => 'Account deleted successfully',
    'deleted_data' => [
      'user_account' => true,
      'progress_data' => true,
      'badges' => true,
      'statistics' => true
    ]
  ]);
} catch (Exception $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['error' => 'Failed to delete account: ' . $e->getMessage()]);
}
