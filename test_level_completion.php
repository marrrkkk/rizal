<?php
// Test level completion with SQLite
echo "Testing Level Completion System...\n\n";

require_once 'backend/rizal/api/db.php';

try {
  // Test user credentials
  $username = 'testuser';
  $password = 'password';

  // Login to get token
  echo "1. Testing login...\n";
  $loginData = json_encode(['username' => $username, 'password' => $password]);
  $context = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => 'Content-Type: application/json',
      'content' => $loginData
    ]
  ]);

  $loginResult = file_get_contents('http://localhost/rizal/api/auth/login.php', false, $context);
  $loginResponse = json_decode($loginResult, true);

  if (!isset($loginResponse['token'])) {
    echo "❌ Login failed: " . json_encode($loginResponse) . "\n";
    exit;
  }

  echo "✓ Login successful\n";
  $token = $loginResponse['token'];

  // Test level completion
  echo "\n2. Testing level completion...\n";
  $completeData = json_encode(['chapter' => 1, 'level' => 1, 'score' => 95]);
  $context = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => [
        'Content-Type: application/json',
        "Authorization: Bearer $token"
      ],
      'content' => $completeData
    ]
  ]);

  $completeResult = file_get_contents('http://localhost/rizal/api/progress/complete_level.php', false, $context);
  $completeResponse = json_decode($completeResult, true);

  if (isset($completeResponse['success']) && $completeResponse['success']) {
    echo "✓ Level completion successful\n";
    if ($completeResponse['nextLevelUnlocked']) {
      echo "  - Next level unlocked: Chapter " . $completeResponse['nextLevelUnlocked']['chapter'] .
        ", Level " . $completeResponse['nextLevelUnlocked']['level'] . "\n";
    }
  } else {
    echo "❌ Level completion failed: " . json_encode($completeResponse) . "\n";
  }

  echo "\n✅ Level completion system working correctly!\n";
} catch (Exception $e) {
  echo "❌ Test failed: " . $e->getMessage() . "\n";
}
