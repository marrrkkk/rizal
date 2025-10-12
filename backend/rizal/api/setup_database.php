<?php
// setup_database.php - Run this to initialize the SQLite database
require_once 'db.php';

try {
  // Read and execute the SQL file
  $sql = file_get_contents(__DIR__ . '/init_progress_tables.sql');

  // Split by semicolon and execute each statement
  $statements = array_filter(array_map('trim', explode(';', $sql)));

  foreach ($statements as $statement) {
    if (!empty($statement) && !preg_match('/^--/', $statement)) {
      $pdo->exec($statement);
      echo "✓ Executed: " . substr($statement, 0, 50) . "...\n";
    }
  }

  // Create a test user for development
  $testUsername = 'testuser';
  $testPassword = password_hash('password', PASSWORD_DEFAULT);

  try {
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
    $stmt->execute([$testUsername, $testPassword]);

    if ($stmt->rowCount() > 0) {
      echo "✓ Created test user: testuser / password\n";

      // Initialize progress for test user
      $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
      $stmt->execute([$testUsername]);
      $userId = $stmt->fetch()['id'];

      $stmt = $pdo->prepare('INSERT OR IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, 1, 1, 1)');
      $stmt->execute([$userId]);

      $stmt = $pdo->prepare('INSERT OR IGNORE INTO user_statistics (user_id) VALUES (?)');
      $stmt->execute([$userId]);

      echo "✓ Initialized progress for test user\n";
    } else {
      echo "✓ Test user already exists\n";
    }
  } catch (Exception $e) {
    echo "⚠️  Test user creation failed: " . $e->getMessage() . "\n";
  }

  echo "\n✅ SQLite database setup completed successfully!\n";
  echo "Database location: " . __DIR__ . "/../database/rizal.db\n";
  echo "Progress tracking tables have been created and initialized.\n";
} catch (Exception $e) {
  echo "❌ Error setting up database: " . $e->getMessage() . "\n";
}
