<?php
// api/auth/change_password.php - Change user password
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
$currentPassword = $data['current_password'] ?? '';
$newPassword = $data['new_password'] ?? '';

if (!$currentPassword || !$newPassword) {
  http_response_code(400);
  echo json_encode(['error' => 'Current password and new password required']);
  exit;
}

if (strlen($newPassword) < 6) {
  http_response_code(400);
  echo json_encode(['error' => 'New password must be at least 6 characters long']);
  exit;
}

try {
  // Get user information
  $stmt = $pdo->prepare('SELECT id, password FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();

  if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
  }

  // Verify current password
  if (!password_verify($currentPassword, $user['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Current password is incorrect']);
    exit;
  }

  // Update password
  $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE id = ?');
  $stmt->execute([$hashedNewPassword, $user['id']]);

  echo json_encode([
    'success' => true,
    'message' => 'Password changed successfully'
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to change password: ' . $e->getMessage()]);
}
