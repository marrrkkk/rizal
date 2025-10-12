<?php
// Simple server test
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: false");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

echo json_encode([
  'status' => 'success',
  'message' => 'Server is working!',
  'timestamp' => date('Y-m-d H:i:s'),
  'method' => $_SERVER['REQUEST_METHOD'],
  'headers' => getallheaders()
]);
