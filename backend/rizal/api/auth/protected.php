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

echo json_encode(['message' => "Hello, $username! This is protected data."]);
