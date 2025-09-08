<?php
// api/auth/register.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request, just respond with 200 OK and exit
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

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
if ($stmt->execute([$username, $hashed_password])) {
    echo json_encode(['message' => 'User registered successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed']);
}
