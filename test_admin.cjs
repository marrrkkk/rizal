const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join('backend', 'rizal.db'));

console.log('=== CHECKING ADMIN USERS ===');

// Check for admin users
db.all('SELECT * FROM users WHERE is_admin = 1', (err, admins) => {
  if (err) {
    console.error('Error getting admin users:', err);
  } else {
    console.log('Admin users found:', admins.length);
    admins.forEach(admin => {
      console.log(`- ID: ${admin.id}, Username: ${admin.username}, Created: ${admin.created_at}`);
    });
  }
  
  // Test the admin query that the backend uses
  const query = `
    SELECT 
      u.id, u.username, u.created_at, u.is_admin,
      COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.chapter_id || '-' || p.level_id END) as completed_levels,
      COUNT(DISTINCT CASE WHEN p.is_completed = 1 THEN p.chapter_id END) as completed_chapters,
      COALESCE(SUM(p.score), 0) as total_score,
      COALESCE(AVG(p.score), 0) as average_score,
      COUNT(DISTINCT b.badge_type) as achievement_count
    FROM users u
    LEFT JOIN user_progress p ON u.id = p.user_id
    LEFT JOIN user_badges b ON u.id = b.user_id
    GROUP BY u.id
    LIMIT 5
  `;
  
  console.log('\n=== TESTING ADMIN QUERY ===');
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error with admin query:', err);
    } else {
      console.log('Query results:');
      rows.forEach(row => {
        console.log(`- User: ${row.username}, Completed: ${row.completed_levels}, Score: ${row.total_score}, Avg: ${Math.round(row.average_score)}`);
      });
    }
    db.close();
  });
});