const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join('backend', 'rizal.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

console.log('=== CHECKING DATABASE TABLES ===');

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    return;
  }
  console.log('Available tables:', tables.map(t => t.name));
  
  // Check users count
  db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
    if (err) {
      console.error('Error counting users:', err);
    } else {
      console.log('Total users in database:', result.count);
    }
    
    // Get sample users
    db.all('SELECT * FROM users LIMIT 5', (err, users) => {
      if (err) {
        console.error('Error getting users:', err);
      } else {
        console.log('\nSample users:');
        users.forEach(user => {
          console.log(`- ID: ${user.id}, Username: ${user.username}, Created: ${user.created_at}, Admin: ${user.is_admin}`);
        });
      }
      
      // Check progress
      db.get('SELECT COUNT(*) as count FROM user_progress', (err, result) => {
        if (err) {
          console.error('Error counting progress:', err);
        } else {
          console.log('\nTotal progress entries:', result.count);
        }
        
        // Get sample progress
        db.all('SELECT * FROM user_progress WHERE is_completed = 1 LIMIT 5', (err, progress) => {
          if (err) {
            console.error('Error getting progress:', err);
          } else {
            console.log('\nSample completed levels:');
            progress.forEach(p => {
              console.log(`- User: ${p.user_id}, Chapter: ${p.chapter_id}, Level: ${p.level_id}, Score: ${p.score}`);
            });
          }
          
          db.close();
        });
      });
    });
  });
});