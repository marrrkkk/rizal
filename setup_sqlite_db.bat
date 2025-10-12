@echo off
echo Setting up SQLite database for Rizal App...
echo.

cd backend\rizal\api
php setup_database.php

echo.
echo Setup complete! You can now run the application.
echo Test user credentials: testuser / password
pause