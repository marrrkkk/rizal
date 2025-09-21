<?php
// debug/check_database.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
header('Content-Type: application/json');

require_once __DIR__ . '/../db.php';

try {
  $results = [];

  // Check if tables exist
  $tables = ['users', 'user_progress', 'user_badges', 'user_statistics'];

  foreach ($tables as $table) {
    $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
    $stmt->execute([$table]);
    $exists = $stmt->fetch() !== false;
    $results['tables'][$table] = $exists;

    if ($exists) {
      // Get table structure
      $stmt = $pdo->prepare("DESCRIBE $table");
      $stmt->execute();
      $results['structure'][$table] = $stmt->fetchAll();

      // Get row count
      $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM $table");
      $stmt->execute();
      $results['counts'][$table] = $stmt->fetch()['count'];
    }
  }

  // Check if there are any users
  if ($results['tables']['users']) {
    $stmt = $pdo->prepare("SELECT id, username FROM users LIMIT 5");
    $stmt->execute();
    $results['sample_users'] = $stmt->fetchAll();
  }

  // Check if there's any progress data
  if ($results['tables']['user_progress']) {
    $stmt = $pdo->prepare("SELECT * FROM user_progress LIMIT 10");
    $stmt->execute();
    $results['sample_progress'] = $stmt->fetchAll();
  }

  echo json_encode($results, JSON_PRETTY_PRINT);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database check failed: ' . $e->getMessage()]);
}
