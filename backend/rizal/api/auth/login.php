<?php
// api/auth/login.php
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

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, username, password, created_at FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
    exit;
}

// Check if user has progress initialized
$stmt = $pdo->prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?');
$stmt->execute([$user['id']]);
$hasProgress = $stmt->fetch()['count'] > 0;

// If no progress, initialize it
if (!$hasProgress) {
    try {
        $pdo->beginTransaction();

        // Initialize Chapter 1, Level 1 as unlocked
        $stmt = $pdo->prepare('INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, 1, 1, 1)');
        $stmt->execute([$user['id']]);

        // Initialize user statistics
        $stmt = $pdo->prepare('INSERT OR IGNORE INTO user_statistics (user_id) VALUES (?)');
        $stmt->execute([$user['id']]);

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        // Continue with login even if progress initialization fails
    }
}

$jwt = createJWT($username);
echo json_encode([
    'token' => $jwt,
    'user' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'created_at' => $user['created_at']
    ],
    'progress_initialized' => true
]);
