@echo off
echo ==========================================
echo      MERN Ecommerce Application
echo ==========================================
echo.

echo [1/4] Checking project directory...
if not exist "backend\server.js" (
    echo ERROR: backend\server.js not found!
    echo Make sure you're in the correct project directory.
    pause
    exit /b 1
)
echo ✅ Project directory confirmed

echo.
echo [2/4] Installing dependencies...
echo Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed

echo.
echo [3/4] Starting Backend Server...
start "Backend Server" cmd /k "echo Starting Backend Server... && npm run dev"

echo.
echo [4/4] Waiting 5 seconds then starting Frontend...
timeout /t 5 /nobreak >nul

cd frontend
start "Frontend Server" cmd /k "echo Starting Frontend Server... && npm run dev"
cd ..

echo.
echo ==========================================
echo           🎉 SERVERS STARTING!
echo ==========================================
echo.
echo 🔗 Access your application at:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5000/api
echo.
echo 📝 Both servers are starting in separate windows
echo    - Keep both windows open during development
echo    - Backend will restart automatically on changes
echo    - Frontend will hot-reload on changes
echo.
echo ⚠️  If you see errors:
echo    1. Check the server windows for error messages
echo    2. Ensure MongoDB is accessible
echo    3. Check .env files exist and are configured
echo.
echo Press any key to close this window...
pause >nul
