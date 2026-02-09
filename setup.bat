@echo off
REM AccessFlow SDK Setup Script for Windows
REM This script helps you set up the AccessFlow SDK for the first time

echo ======================================
echo AccessFlow SDK Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo         Visit: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: %NPM_VERSION%
echo.

REM Install dependencies
echo [INFO] Installing project dependencies...
call npm install

echo.
echo [INFO] Installing AccessFlow SDK from local package...
call npm install .\acsbe-accessflow-sdk-1.0.1.tgz

echo.
echo [OK] Dependencies installed successfully!
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [WARNING] Please edit .env and add your AccessFlow API key
    echo.
) else (
    echo [INFO] .env file already exists
    echo.
)

REM Install Playwright browsers
echo [INFO] Installing Playwright browsers...
call npx playwright install chromium

echo.
echo ======================================
echo [OK] Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Edit .env and add your AccessFlow API key
echo 2. Run tests: npm test
echo 3. View reports: npx playwright show-report
echo.
echo For detailed documentation, see:
echo   - ACCESSFLOW-SETUP.md
echo   - README.md
echo.

pause
