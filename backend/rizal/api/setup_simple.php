<?php
// Simple SQLite database setup
$dbPath = __DIR__ . '/../database/rizal.db';
$dbDir = dirname($dbPath);

// Create database directory if it doesn't exist
if (!is_dir($dbDir)) {
  mkdir($dbDir, 0755, true);
  echo "✓ Created database directory\n";
}

try {
  $pdo = new PDO("sqlite:$dbPath");
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec('PRAGMA foreign_keys = ON');

  echo "✓ Connected to SQLite database\n";

  // Create users table
  $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
  echo "✓ Created users table\n";

  // Create user_progress table
  $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            chapter_id INTEGER NOT NULL,
            level_id INTEGER NOT NULL,
            is_unlocked INTEGER DEFAULT 0,
            is_completed INTEGER DEFAULT 0,
            score INTEGER DEFAULT 0,
            completion_date DATETIME NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, chapter_id, level_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
  echo "✓ Created user_progress table\n";

  // Create user_badges table
  $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            badge_type TEXT NOT NULL,
            badge_name TEXT NOT NULL,
            earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, badge_type),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
  echo "✓ Created user_badges table\n";

  // Create user_statistics table
  $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_statistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            total_levels_completed INTEGER DEFAULT 0,
            total_score INTEGER DEFAULT 0,
            average_score REAL DEFAULT 0.0,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_played_date DATE NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
  echo "✓ Created user_statistics table\n";

  // Create triggers
  $pdo->exec("
        CREATE TRIGGER IF NOT EXISTS update_user_progress_timestamp 
            AFTER UPDATE ON user_progress
        BEGIN
            UPDATE user_progress SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
    ");
  echo "✓ Created user_progress trigger\n";

  $pdo->exec("
        CREATE TRIGGER IF NOT EXISTS update_user_statistics_timestamp 
            AFTER UPDATE ON user_statistics
        BEGIN
            UPDATE user_statistics SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
    ");
  echo "✓ Created user_statistics trigger\n";

  // Create test user
  $testUsername = 'testuser';
  $testPassword = password_hash('password', PASSWORD_DEFAULT);

  $stmt = $pdo->prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
  $stmt->execute([$testUsername, $testPassword]);

  if ($stmt->rowCount() > 0) {
    echo "✓ Created test user: testuser / password\n";
  } else {
    echo "✓ Test user already exists\n";
  }

  // Get user ID and initialize progress
  $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
  $stmt->execute([$testUsername]);
  $user = $stmt->fetch();

  if ($user) {
    $userId = $user['id'];

    // Initialize Chapter 1, Level 1 as unlocked
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, 1, 1, 1)');
    $stmt->execute([$userId]);
    echo "✓ Initialized Chapter 1, Level 1 for test user\n";

    // Initialize user statistics
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO user_statistics (user_id) VALUES (?)');
    $stmt->execute([$userId]);
    echo "✓ Initialized statistics for test user\n";
  }

  echo "\n✅ SQLite database setup completed successfully!\n";
  echo "Database location: $dbPath\n";
  echo "Test user: testuser / password\n";
  echo "You can now run the Rizal app!\n";
} catch (Exception $e) {
  echo "❌ Error: " . $e->getMessage() . "\n";
}
