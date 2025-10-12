<?php
// Test database connection and data
require_once 'db.php';

try {
  echo "Testing SQLite database...\n\n";

  // Test users table
  $stmt = $pdo->query('SELECT COUNT(*) as count FROM users');
  $userCount = $stmt->fetch()['count'];
  echo "✓ Users table: $userCount users found\n";

  // Show test user
  $stmt = $pdo->query('SELECT username, created_at FROM users LIMIT 1');
  $user = $stmt->fetch();
  if ($user) {
    echo "✓ Test user: {$user['username']} (created: {$user['created_at']})\n";
  }

  // Test progress table
  $stmt = $pdo->query('SELECT COUNT(*) as count FROM user_progress');
  $progressCount = $stmt->fetch()['count'];
  echo "✓ Progress table: $progressCount records found\n";

  // Show initial progress
  $stmt = $pdo->query('SELECT u.username, up.chapter_id, up.level_id, up.is_unlocked FROM user_progress up JOIN users u ON up.user_id = u.id');
  $progress = $stmt->fetchAll();
  foreach ($progress as $p) {
    $status = $p['is_unlocked'] ? 'unlocked' : 'locked';
    echo "  - {$p['username']}: Chapter {$p['chapter_id']}, Level {$p['level_id']} ($status)\n";
  }

  // Test badges table
  $stmt = $pdo->query('SELECT COUNT(*) as count FROM user_badges');
  $badgeCount = $stmt->fetch()['count'];
  echo "✓ Badges table: $badgeCount badges found\n";

  // Test statistics table
  $stmt = $pdo->query('SELECT COUNT(*) as count FROM user_statistics');
  $statsCount = $stmt->fetch()['count'];
  echo "✓ Statistics table: $statsCount records found\n";

  echo "\n✅ Database is working correctly!\n";
  echo "You can now test the progress system with the web app.\n";
} catch (Exception $e) {
  echo "❌ Database test failed: " . $e->getMessage() . "\n";
}
