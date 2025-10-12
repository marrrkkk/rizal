-- SQL script to create progress tracking tables for SQLite
-- Run this to initialize the SQLite database

-- Create users table first (if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_progress table to track level completion and unlocking
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
);

-- Create user_badges table to track earned badges
CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_type TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_statistics table for overall progress tracking
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
);

-- Create trigger to update updated_at timestamp for user_progress
CREATE TRIGGER IF NOT EXISTS update_user_progress_timestamp 
    AFTER UPDATE ON user_progress
BEGIN
    UPDATE user_progress SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger to update updated_at timestamp for user_statistics
CREATE TRIGGER IF NOT EXISTS update_user_statistics_timestamp 
    AFTER UPDATE ON user_statistics
BEGIN
    UPDATE user_statistics SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;