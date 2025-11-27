const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key_here'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.resolve(__dirname, 'rizal.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_admin INTEGER DEFAULT 0
    )`);

        // Migration: Add is_admin column if missing
        db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0", () => { });

        // User progress table
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

        // User badges table
        db.run(`CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_type TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, badge_type),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

        // User statistics table
        db.run(`CREATE TABLE IF NOT EXISTS user_statistics (
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
    )`);
    });
}

// Helper to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        db.get('SELECT is_admin FROM users WHERE id = ?', [user.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row || row.is_admin !== 1) return res.status(403).json({ error: 'Admin access required' });
            next();
        });
    });
};

// Routes

// Login
app.post('/api/auth/login', (req, res) => {
    // Note: Keeping .php extension in route for compatibility with existing frontend code if needed, 
    // but ideally we should clean up frontend routes too. 
    // For now, let's match what the frontend expects.
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'User not found' });

        // In a real app, use bcrypt.compare. For this demo/migration, we might need to handle plain text if that's what was used,
        // or bcrypt if the PHP app used it. The PHP code used password_verify.
        // Let's assume we are starting fresh or using bcrypt.

        // Check if password matches (assuming bcrypt for new users, or plain text for legacy/test)
        // For simplicity in this "fix", let's try direct comparison first, then bcrypt
        let valid = false;
        if (user.password === password) valid = true;
        else valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username }
        });
    });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }

        // Initialize progress for new user (all levels unlocked)
        const userId = this.lastID;

        // Unlock all levels for all chapters (6 chapters × 5 levels)
        const insertPromises = [];
        for (let chapter = 1; chapter <= 6; chapter++) {
            for (let level = 1; level <= 5; level++) {
                insertPromises.push(
                    new Promise((resolve, reject) => {
                        db.run(
                            'INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, ?, ?, 1)',
                            [userId, chapter, level],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    })
                );
            }
        }

        Promise.all(insertPromises).catch(err => {
            console.error("Error initializing progress:", err);
        });

        res.json({ success: true, message: 'User registered successfully' });
    });
});

// Get Progress
app.get('/api/progress/get_progress', authenticateToken, (req, res) => {
    const username = req.user.username;

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        const userId = user.id;

        // Fetch all progress
        db.all('SELECT * FROM user_progress WHERE user_id = ?', [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            // Format response to match what frontend expects
            const chapters = {};

            // Initialize chapters 1-6
            for (let i = 1; i <= 6; i++) {
                chapters[i] = {
                    chapterId: i,
                    unlockedLevels: [],
                    completedLevels: [],
                    scores: {},
                    badges: [] // We'll populate this later
                };
            }

            rows.forEach(row => {
                const cId = row.chapter_id;
                if (!chapters[cId]) return;

                // Always unlock all levels
                chapters[cId].unlockedLevels = [1, 2, 3, 4, 5];

                if (row.is_completed) {
                    chapters[cId].completedLevels.push(row.level_id);
                    chapters[cId].scores[row.level_id] = row.score;
                }
            });

            // Get badges
            db.all('SELECT * FROM user_badges WHERE user_id = ?', [userId], (err, badges) => {
                if (err) return res.status(500).json({ error: err.message });

                const badgeList = badges.map(b => b.badge_type);

                // Calculate overall stats
                let totalLevels = 30; // 6 chapters * 5 levels
                let completedLevels = 0;
                let totalScore = 0;

                Object.values(chapters).forEach(c => {
                    completedLevels += c.completedLevels.length;
                    Object.values(c.scores).forEach(s => totalScore += s);
                });

                res.json({
                    chapters,
                    overall: {
                        totalLevels,
                        completedLevels,
                        totalScore
                    },
                    badges: badgeList
                });
            });
        });
    });
});

// Complete Level
app.post('/api/progress/complete_level', authenticateToken, (req, res) => {
    let { chapter, level, score } = req.body;
    chapter = parseInt(chapter);
    level = parseInt(level);
    score = parseInt(score) || 0;
    const username = req.user.username;

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        const userId = user.id;

        // Check current progress
        db.get('SELECT * FROM user_progress WHERE user_id = ? AND chapter_id = ? AND level_id = ?',
            [userId, chapter, level], (err, currentProgress) => {
                if (err) return res.status(500).json({ error: err.message });

                const previousScore = currentProgress ? currentProgress.score : 0;
                const newScore = Math.max(previousScore, score);

                // Update or Insert - mark as completed
                const updateQuery = `
          INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked, is_completed, score, completion_date, updated_at)
          VALUES (?, ?, ?, 1, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id, chapter_id, level_id) 
          DO UPDATE SET is_completed=1, score=?, completion_date=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP
        `;

                db.run(updateQuery, [userId, chapter, level, newScore, newScore], function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    const newBadges = [];

                    // Check for Chapter Completion
                    db.get('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND chapter_id = ? AND is_completed = 1',
                        [userId, chapter], (err, row) => {
                            const completedCount = row ? row.count : 0;
                            const chapterComplete = completedCount >= 5;

                            if (chapterComplete) {
                                // Award Chapter Badge
                                const badgeType = `chapter_${chapter}_complete`;
                                const badgeName = `Chapter ${chapter} Master`;
                                db.run('INSERT OR IGNORE INTO user_badges (user_id, badge_type, badge_name) VALUES (?, ?, ?)',
                                    [userId, badgeType, badgeName], function (err) {
                                        if (!err && this.changes > 0) newBadges.push(badgeType);

                                        // Send response
                                        res.json({
                                            success: true,
                                            message: 'Level completed',
                                            newBadges,
                                            chapterComplete
                                        });
                                    });
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Level completed',
                                    newBadges,
                                    chapterComplete: false
                                });
                            }
                        });
                });
            });
    });
});

// Initialize Progress (if needed)
app.post('/api/progress/initialize_progress', authenticateToken, (req, res) => {
    // Just return success, we handle init on register
    res.json({ success: true });
});

// Admin Routes
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
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
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    const stats = {};

    // Total Users
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalUsers = row.count;

        // Completed Levels
        db.get('SELECT COUNT(*) as count FROM user_progress WHERE is_completed = 1', (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.totalCompletedLevels = row.count;

            // Total Badges
            db.get('SELECT COUNT(*) as count FROM user_badges', (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.totalBadges = row.count;

                res.json(stats);
            });
        });
    });
});

app.delete('/api/admin/users/:id', authenticateAdmin, (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'User deleted' });
    });
});

app.get('/api/admin/users/:id', authenticateAdmin, (req, res) => {
    const userId = req.params.id;

    db.get('SELECT id, username, created_at, is_admin FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Get Progress
        db.all('SELECT * FROM user_progress WHERE user_id = ?', [userId], (err, progress) => {
            if (err) return res.status(500).json({ error: err.message });

            // Get Badges
            db.all('SELECT * FROM user_badges WHERE user_id = ?', [userId], (err, badges) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    user,
                    progress,
                    badges
                });
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
