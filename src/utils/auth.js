// Authentication utilities for SQLite-based authentication
import bcrypt from "bcryptjs";
import * as jose from "jose";
import {
  initDatabase,
  executeQuery,
  executeQueryOne,
  executeUpdate,
  getLastInsertId,
} from "./database.js";

// JWT secret key - in production, this should be an environment variable
const JWT_SECRET = new TextEncoder().encode("rizal-app-secret-key-2024");
const JWT_EXPIRATION = "7d"; // Token expires in 7 days

// Initialize database on module load
let dbInitialized = false;
const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 * @param {object} payload - User data to encode in token
 * @returns {Promise<string>} - JWT token
 */
export const generateToken = async (payload) => {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);
  return token;
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} - Decoded token payload or null if invalid
 */
export const verifyToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @param {string} email - Email address (optional)
 * @returns {Promise<object>} - User object and token
 */
export const register = async (username, password, email = null) => {
  await ensureDatabase();

  // Validate input
  if (!username || username.trim().length === 0) {
    throw new Error("Username is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if username already exists
  const existingUser = executeQueryOne(
    "SELECT id FROM users WHERE username = ?",
    [username.trim()]
  );

  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Check if email already exists (if provided)
  if (email && email.trim().length > 0) {
    const existingEmail = executeQueryOne(
      "SELECT id FROM users WHERE email = ?",
      [email.trim()]
    );

    if (existingEmail) {
      throw new Error("Email already exists");
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Insert user into database
  executeUpdate(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [
      username.trim(),
      email && email.trim().length > 0 ? email.trim() : null,
      passwordHash,
    ]
  );

  // Get the newly created user by querying (more reliable than last_insert_rowid)
  const newUser = executeQueryOne("SELECT id FROM users WHERE username = ?", [
    username.trim(),
  ]);

  if (!newUser || !newUser.id) {
    throw new Error("Failed to create user account");
  }

  const userId = newUser.id;

  // Initialize user statistics
  executeUpdate("INSERT INTO user_statistics (user_id) VALUES (?)", [userId]);

  // Initialize first level (Chapter 1, Level 1) as unlocked
  executeUpdate(
    "INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked) VALUES (?, 1, 1, 1)",
    [userId]
  );

  // Generate JWT token
  const token = await generateToken({
    userId,
    username: username.trim(),
    isAdmin: false,
  });

  return {
    token,
    user: {
      id: userId,
      username: username.trim(),
      email: email && email.trim().length > 0 ? email.trim() : null,
      isAdmin: false,
    },
  };
};

/**
 * Login a user
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<object>} - User object and token
 */
export const login = async (username, password) => {
  await ensureDatabase();

  // Validate input
  if (!username || username.trim().length === 0) {
    throw new Error("Username is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  // Query user from database
  const user = executeQueryOne(
    "SELECT id, username, email, password_hash, is_admin FROM users WHERE username = ?",
    [username.trim()]
  );

  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  // Generate JWT token
  const token = await generateToken({
    userId: user.id,
    username: user.username,
    isAdmin: user.is_admin === 1,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.is_admin === 1,
    },
  };
};

/**
 * Get current user from token
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} - User data or null if invalid
 */
export const getCurrentUser = async (token) => {
  const decoded = await verifyToken(token);
  return decoded;
};

/**
 * Get user ID from username
 * @param {string} username - Username
 * @returns {Promise<number|null>} - User ID or null if not found
 */
export const getUserIdFromUsername = async (username) => {
  try {
    await ensureDatabase();
    const user = executeQueryOne("SELECT id FROM users WHERE username = ?", [
      username,
    ]);
    return user ? user.id : null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

/**
 * Get current user from localStorage
 * @returns {object|null} - User data or null if not logged in
 */
export const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    // Decode token to get user info (without verification for client-side)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.userId,
      username: payload.username,
      isAdmin: payload.isAdmin || false,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

/**
 * Logout user (client-side only - clear token)
 * @returns {boolean} - Always returns true
 */
export const logout = () => {
  // Token is managed by the client, so logout just means clearing it
  return true;
};
