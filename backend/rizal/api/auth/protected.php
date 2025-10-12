<?php
// api/auth/protected.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request, just respond with 200 OK and exit
    http_response_code(200);
    exit();
}
header('Content-Type: application/json');
require_once __DIR__ . '/../jwt.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Authorization header missing or malformed']);
    exit;
}

$token = $matches[1];
$username = validateJWT($token);

if (!$username) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}

// Get user information from database
require_once __DIR__ . '/../db.php';

try {
    $stmt = $pdo->prepare('SELECT id, username, created_at FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    // Get basic progress info
    $stmt = $pdo->prepare('SELECT COUNT(*) as total_completed FROM user_progress WHERE user_id = ? AND is_completed = 1');
    $stmt->execute([$user['id']]);
    $progressInfo = $stmt->fetch();

    echo json_encode([
        'message' => "Hello, $username! This is protected data.",
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'created_at' => $user['created_at'],
            'levels_completed' => (int)$progressInfo['total_completed']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'message' => "Hello, $username! This is protected data.",
        'user' => ['username' => $username]
    ]);
}
