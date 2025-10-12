<?php
// api/auth/register.php
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

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$username]);
if ($stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Username already exists']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Create user
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    $stmt->execute([$username, $hashed_password]);

    // Get the new user ID
    $userId = $pdo->lastInsertId();

    // Initialize progress for new user (Chapter 1, Level 1 unlocked)
    $stmt = $pdo->prepare('INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, 1, 1, 1)');
    $stmt->execute([$userId]);

    // Initialize user statistics
    $stmt = $pdo->prepare('INSERT INTO user_statistics (user_id) VALUES (?)');
    $stmt->execute([$userId]);

    $pdo->commit();

    echo json_encode([
        'message' => 'User registered successfully',
        'user_id' => $userId,
        'progress_initialized' => true
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
}
