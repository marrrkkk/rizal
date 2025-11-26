const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../backend/rizal.db');
const db = new sqlite3.Database(dbPath);

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log("Usage: node scripts/create_admin.cjs <username> <password>");
    process.exit(1);
}

const hashedPassword = bcrypt.hashSync(password, 10);

db.serialize(() => {
    // Ensure is_admin column exists (in case server hasn't run yet)
    db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0", (err) => {
        // Ignore error if column exists
    });

    db.run(`INSERT INTO users (username, password, is_admin) VALUES (?, ?, 1)`,
        [username, hashedPassword],
        function (err) {
            if (err) {
                console.error("Error creating admin:", err.message);
            } else {
                console.log(`Admin user '${username}' created successfully.`);
            }
            db.close();
        }
    );
});
