<?php
// Test API endpoints
echo "Testing Rizal App API Endpoints...\n\n";

// Test login
echo "1. Testing login...\n";
$loginData = json_encode(['username' => 'testuser', 'password' => 'password']);
$loginResult = file_get_contents('http://localhost/rizal/api/auth/login.php', false, stream_context_create([
  'http' => [
    'method' => 'POST',
    'header' => 'Content-Type: application/json',
    'content' => $loginData
  ]
]));

$loginResponse = json_decode($loginResult, true);
if (isset($loginResponse['token'])) {
  echo "✓ Login successful\n";
  $token = $loginResponse['token'];

  // Test get progress
  echo "\n2. Testing get progress...\n";
  $progressResult = file_get_contents('http://localhost/rizal/api/progress/get_progress.php', false, stream_context_create([
    'http' => [
      'method' => 'GET',
      'header' => "Authorization: Bearer $token"
    ]
  ]));

  $progressResponse = json_decode($progressResult, true);
  if (isset($progressResponse['chapters'])) {
    echo "✓ Progress API working\n";
    echo "  - Total levels: " . $progressResponse['overall']['totalLevels'] . "\n";
    echo "  - Completed levels: " . $progressResponse['overall']['completedLevels'] . "\n";
    echo "  - Chapter 1 unlocked levels: " . count($progressResponse['chapters']['1']['unlockedLevels']) . "\n";
  } else {
    echo "❌ Progress API failed: " . json_encode($progressResponse) . "\n";
  }

  // Test complete level
  echo "\n3. Testing complete level...\n";
  $completeData = json_encode(['chapter' => 1, 'level' => 1, 'score' => 85]);
  $completeResult = file_get_contents('http://localhost/rizal/api/progress/complete_level.php', false, stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => [
        'Content-Type: application/json',
        "Authorization: Bearer $token"
      ],
      'content' => $completeData
    ]
  ]));

  $completeResponse = json_decode($completeResult, true);
  if (isset($completeResponse['success']) && $completeResponse['success']) {
    echo "✓ Level completion working\n";
    if ($completeResponse['nextLevelUnlocked']) {
      echo "  - Next level unlocked: Chapter " . $completeResponse['nextLevelUnlocked']['chapter'] . ", Level " . $completeResponse['nextLevelUnlocked']['level'] . "\n";
    }
    if (!empty($completeResponse['newBadges'])) {
      echo "  - New badges earned: " . implode(', ', $completeResponse['newBadges']) . "\n";
    }
  } else {
    echo "❌ Level completion failed: " . json_encode($completeResponse) . "\n";
  }
} else {
  echo "❌ Login failed: " . json_encode($loginResponse) . "\n";
}

echo "\n✅ API testing complete!\n";
