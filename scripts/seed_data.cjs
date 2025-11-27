const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../backend/rizal.db');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

async function seed() {
    console.log('🌱 Starting database seeding...');

    // Create tables if they don't exist (simplified version of server.cjs logic)
    await new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_admin INTEGER DEFAULT 0
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS user_progress (
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
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS user_badges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                badge_type TEXT NOT NULL,
                badge_name TEXT NOT NULL,
                earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, badge_type),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);

            resolve();
        });
    });

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    await runQuery(
        'INSERT OR IGNORE INTO users (username, password, is_admin) VALUES (?, ?, 1)',
        ['admin', adminPassword]
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create Regular Users
    const users = [
        { username: 'student1', password: 'password123' },
        { username: 'student2', password: 'password123' },
        { username: 'maria_clara', password: 'password123' },
        { username: 'pepe', password: 'password123' }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await runQuery(
            'INSERT OR IGNORE INTO users (username, password, is_admin) VALUES (?, ?, 0)',
            [user.username, hashedPassword]
        );
    }
    console.log(`✅ ${users.length} regular users created`);

    // Add Progress Data
    const allUsers = await getQuery('SELECT id, username FROM users');

    for (const user of allUsers) {
        // Initialize all levels as unlocked
        for (let chapter = 1; chapter <= 6; chapter++) {
            for (let level = 1; level <= 5; level++) {
                await runQuery(
                    'INSERT OR IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, ?, ?, 1)',
                    [user.id, chapter, level]
                );
            }
        }

        // Add some random completion data
        if (user.username !== 'admin') {
            const completedCount = Math.floor(Math.random() * 20) + 5; // 5 to 25 levels

            for (let i = 0; i < completedCount; i++) {
                const chapter = Math.floor(Math.random() * 6) + 1;
                const level = Math.floor(Math.random() * 5) + 1;
                const score = Math.floor(Math.random() * 50) + 50; // 50-100 score

                await runQuery(
                    `INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked, is_completed, score, completion_date)
                     VALUES (?, ?, ?, 1, 1, ?, CURRENT_TIMESTAMP)
                     ON CONFLICT(user_id, chapter_id, level_id) 
                     DO UPDATE SET is_completed=1, score=?, completion_date=CURRENT_TIMESTAMP`,
                    [user.id, chapter, level, score, score]
                );
            }

            // Add some badges
            const badges = [
                { type: 'chapter_1_complete', name: 'Childhood Master' },
                { type: 'chapter_2_complete', name: 'Education Master' },
                { type: 'perfect_score', name: 'Perfectionist' }
            ];

            if (Math.random() > 0.5) {
                const badge = badges[Math.floor(Math.random() * badges.length)];
                await runQuery(
                    'INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name) VALUES (?, ?, ?)',
                    [user.id, badge.type, badge.name]
                );
            }
        }
    }
    console.log('✅ Mock progress data added');

    db.close();
    console.log('✨ Seeding completed successfully!');
}

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
