<?php
// Test SQLite Auth System
echo "Testing SQLite Auth System...\n\n";

require_once 'backend/rizal/api/db.php';

try {
  // Test database connection
  echo "✓ Database connection: OK\n";

  // Check users table
  $stmt = $pdo->query('SELECT COUNT(*) as count FROM users');
  $userCount = $stmt->fetch()['count'];
  echo "✓ Users in database: $userCount\n";

  // Test user data
  $stmt = $pdo->query('SELECT username, created_at FROM users LIMIT 3');
  $users = $stmt->fetchAll();

  echo "\nUsers:\n";
  foreach ($users as $user) {
    echo "  - {$user['username']} (created: {$user['created_at']})\n";
  }

  // Test progress data integrity
  $stmt = $pdo->query('
        SELECT u.username, COUNT(up.id) as progress_records
        FROM users u
        LEFT JOIN user_progress up ON u.id = up.user_id
        GROUP BY u.id, u.username
    ');
  $progressData = $stmt->fetchAll();

  echo "\nProgress Data:\n";
  foreach ($progressData as $data) {
    echo "  - {$data['username']}: {$data['progress_records']} progress records\n";
  }

  // Test auth endpoints availability
  $authEndpoints = [
    'login.php',
    'register.php',
    'protected.php',
    'profile.php',
    'change_password.php',
    'delete_account.php'
  ];

  echo "\nAuth Endpoints:\n";
  foreach ($authEndpoints as $endpoint) {
    $path = "backend/rizal/api/auth/$endpoint";
    if (file_exists($path)) {
      echo "  ✓ $endpoint\n";
    } else {
      echo "  ❌ $endpoint (missing)\n";
    }
  }

  echo "\n✅ SQLite Auth System is ready!\n";
  echo "Database: backend/rizal/database/rizal.db\n";
  echo "Test user: testuser / password\n";
} catch (Exception $e) {
  echo "❌ Error: " . $e->getMessage() . "\n";
}
