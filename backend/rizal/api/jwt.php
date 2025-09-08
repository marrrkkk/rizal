<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "rizal_secret_key";

function createJWT($username) {
    global $secret_key;
    $issuedAt = time();
    $expire = $issuedAt + 3600; // token valid 1 hour
    $payload = [
        'iat' => $issuedAt,
        'exp' => $expire,
        'sub' => $username,
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
}

function validateJWT($jwt) {
    global $secret_key;
    try {
        // In v6, you must create a Key object here:
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
        return $decoded->sub;
    } catch (Exception $e) {
        return false;
    }
}
