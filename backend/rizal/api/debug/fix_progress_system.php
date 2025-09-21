<?php
// debug/fix_progress_system.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../jwt.php';

// Verify JWT token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
  http_response_code(401);
  echo json_encode(['error' => 'Authorization token required']);
  exit;
}

$jwt = $matches[1];
$username = validateJWT($jwt);

if (!$username) {
  http_response_code(401);
  echo json_encode(['error' => 'Invalid token']);
  exit;
}

try {
  $results = [];

  // Get user ID
  $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();

  if (!$user) {
    throw new Exception('User not found');
  }

  $userId = $user['id'];
  $results['user_id'] = $userId;
  $results['username'] = $username;

  // Check if progress tables exist and create them if needed
  $tables = [
    'user_progress' => "
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        chapter_id INT NOT NULL,
        level_id INT NOT NULL,
        is_unlocked BOOLEAN DEFAULT FALSE,
        is_completed BOOLEAN DEFAULT FALSE,
        score INT DEFAULT 0,
        completion_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_chapter_level (user_id, chapter_id, level_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    ",
    'user_badges' => "
      CREATE TABLE IF NOT EXISTS user_badges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        badge_type VARCHAR(50) NOT NULL,
        badge_name VARCHAR(100) NOT NULL,
        earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_badge (user_id, badge_type),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    ",
    'user_statistics' => "
      CREATE TABLE IF NOT EXISTS user_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        total_levels_completed INT DEFAULT 0,
        total_score INT DEFAULT 0,
        average_score DECIMAL(5,2) DEFAULT 0.00,
        current_streak INT DEFAULT 0,
        longest_streak INT DEFAULT 0,
        last_played_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    "
  ];

  foreach ($tables as $tableName => $createSQL) {
    $pdo->exec($createSQL);
    $results['tables_created'][] = $tableName;
  }

  // Initialize user progress if not exists
  $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?');
  $stmt->execute([$userId]);
  $hasProgress = $stmt->fetch()['count'] > 0;

  if (!$hasProgress) {
    // Initialize Chapter 1, Level 1 as unlocked
    $stmt = $pdo->prepare('
      INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
      VALUES (?, 1, 1, TRUE)
    ');
    $stmt->execute([$userId]);
    $results['initialized_progress'] = true;
  } else {
    $results['initialized_progress'] = false;
    $results['existing_progress'] = true;
  }

  // Initialize user statistics if not exists
  $stmt = $pdo->prepare('
    INSERT IGNORE INTO user_statistics (user_id)
    VALUES (?)
  ');
  $stmt->execute([$userId]);

  // Get current progress
  $stmt = $pdo->prepare('
    SELECT chapter_id, level_id, is_unlocked, is_completed, score
    FROM user_progress 
    WHERE user_id = ? 
    ORDER BY chapter_id, level_id
  ');
  $stmt->execute([$userId]);
  $results['current_progress'] = $stmt->fetchAll();

  // Test completing level 1-1 if it's unlocked but not completed
  $stmt = $pdo->prepare('
    SELECT is_unlocked, is_completed 
    FROM user_progress 
    WHERE user_id = ? AND chapter_id = 1 AND level_id = 1
  ');
  $stmt->execute([$userId]);
  $level1Status = $stmt->fetch();

  if ($level1Status && $level1Status['is_unlocked'] && !$level1Status['is_completed']) {
    // Complete level 1-1 and unlock level 1-2
    $pdo->beginTransaction();

    // Mark level 1-1 as completed
    $stmt = $pdo->prepare('
      UPDATE user_progress 
      SET is_completed = TRUE, score = 85, completion_date = NOW()
      WHERE user_id = ? AND chapter_id = 1 AND level_id = 1
    ');
    $stmt->execute([$userId]);

    // Unlock level 1-2
    $stmt = $pdo->prepare('
      INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
      VALUES (?, 1, 2, TRUE)
      ON DUPLICATE KEY UPDATE is_unlocked = TRUE
    ');
    $stmt->execute([$userId]);

    $pdo->commit();
    $results['test_completion'] = 'Level 1-1 completed and Level 1-2 unlocked';
  }

  // Get final progress state
  $stmt = $pdo->prepare('
    SELECT chapter_id, level_id, is_unlocked, is_completed, score
    FROM user_progress 
    WHERE user_id = ? 
    ORDER BY chapter_id, level_id
  ');
  $stmt->execute([$userId]);
  $results['final_progress'] = $stmt->fetchAll();

  echo json_encode($results, JSON_PRETTY_PRINT);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Fix failed: ' . $e->getMessage()]);
}
