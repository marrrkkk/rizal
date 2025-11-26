// SQLite database utilities for client-side database operations
import initSqlJs from "sql.js";

let SQL = null;
let db = null;

// Initialize SQL.js
export const initDatabase = async () => {
  if (SQL) return db;

  try {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem("rizal_database");

    if (savedDb) {
      // Load existing database
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      // Create new database
      db = new SQL.Database();

      // Initialize tables
      await initializeTables();
    }

    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Initialize database tables
const initializeTables = async () => {
  if (!db) throw new Error("Database not initialized");

  // Create users table with password_hash column
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_admin INTEGER DEFAULT 0
    )
  `);

  // Create user_progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      chapter_id INTEGER NOT NULL,
      level_id INTEGER NOT NULL,
      is_unlocked INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      final_score INTEGER,
      completion_date DATETIME NULL,
      attempts INTEGER DEFAULT 0,
      hints_used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, chapter_id, level_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create achievements table
  db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_name TEXT NOT NULL,
      achievement_type TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create user_statistics table
  db.run(`
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
  `);

  saveDatabase();
};

// Save database to localStorage
export const saveDatabase = () => {
  if (!db) return;

  try {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem("rizal_database", JSON.stringify(buffer));
  } catch (error) {
    console.error("Failed to save database:", error);
  }
};

// Execute a query
export const executeQuery = (sql, params = []) => {
  if (!db) throw new Error("Database not initialized");

  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);

    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();

    saveDatabase();
    return results;
  } catch (error) {
    console.error("Query execution failed:", error);
    throw error;
  }
};

// Execute a query and return the first result
export const executeQueryOne = (sql, params = []) => {
  const results = executeQuery(sql, params);
  return results.length > 0 ? results[0] : null;
};

// Execute a query without returning results (INSERT, UPDATE, DELETE)
export const executeUpdate = (sql, params = []) => {
  if (!db) throw new Error("Database not initialized");

  try {
    db.run(sql, params);
    saveDatabase();
    return true;
  } catch (error) {
    console.error("Update execution failed:", error);
    throw error;
  }
};

// Get the last inserted row ID
export const getLastInsertId = () => {
  if (!db) throw new Error("Database not initialized");

  const result = db.exec("SELECT last_insert_rowid() as id");
  return result[0]?.values[0]?.[0] || null;
};

// Export database instance getter
export const getDatabase = () => db;
