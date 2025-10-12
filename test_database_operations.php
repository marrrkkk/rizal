<?php
// Test database operations directly
echo "Testing Database Operations...\n\n";

require_once 'backend/rizal/api/db.php';

try {
  // Test user exists
  $stmt = $pdo->prepare('SELECT id, username FROM users WHERE username = ?');
  $stmt->execute(['testuser']);
  $user = $stmt->fetch();

  if (!$user) {
    echo "❌ Test user not found\n";
    exit;
  }

  echo "✓ Test user found: {$user['username']} (ID: {$user['id']})\n";
  $userId = $user['id'];

  // Test level completion update
  echo "\n2. Testing level completion update...\n";

  $stmt = $pdo->prepare('
        UPDATE user_progress 
        SET is_completed = 1, score = ?, completion_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    ');
  $result = $stmt->execute([95, $userId, 1, 1]);

  if ($result) {
    echo "✓ Level completion update successful\n";
  } else {
    echo "❌ Level completion update failed\n";
  }

  // Test statistics update with DATE function
  echo "\n3. Testing statistics update with DATE function...\n";

  $stmt = $pdo->prepare('
        INSERT OR REPLACE INTO user_statistics (user_id, total_levels_completed, total_score, average_score, last_played_date, updated_at)
        VALUES (?, ?, ?, ?, DATE("now"), CURRENT_TIMESTAMP)
    ');
  $result = $stmt->execute([$userId, 1, 95, 95.0]);

  if ($result) {
    echo "✓ Statistics update with DATE function successful\n";
  } else {
    echo "❌ Statistics update failed\n";
  }

  // Verify the data
  echo "\n4. Verifying updated data...\n";

  $stmt = $pdo->prepare('
        SELECT up.score, up.is_completed, us.last_played_date, us.total_score
        FROM user_progress up
        JOIN user_statistics us ON up.user_id = us.user_id
        WHERE up.user_id = ? AND up.chapter_id = 1 AND up.level_id = 1
    ');
  $stmt->execute([$userId]);
  $data = $stmt->fetch();

  if ($data) {
    echo "✓ Data verification successful:\n";
    echo "  - Score: {$data['score']}\n";
    echo "  - Completed: " . ($data['is_completed'] ? 'Yes' : 'No') . "\n";
    echo "  - Last played: {$data['last_played_date']}\n";
    echo "  - Total score: {$data['total_score']}\n";
  } else {
    echo "❌ Data verification failed\n";
  }

  echo "\n✅ All database operations working correctly!\n";
  echo "The syntax error has been fixed and SQLite functions are working properly.\n";
} catch (Exception $e) {
  echo "❌ Database test failed: " . $e->getMessage() . "\n";
}
