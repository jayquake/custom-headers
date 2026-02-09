#!/bin/bash

# AccessFlow SDK Setup Script
# This script helps you set up the AccessFlow SDK for the first time

set -e

echo "======================================"
echo "AccessFlow SDK Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

echo ""
echo "📦 Installing AccessFlow SDK from local package..."
npm install ./acsbe-accessflow-sdk-1.0.1.tgz

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your AccessFlow API key"
    echo ""
else
    echo "ℹ️  .env file already exists"
    echo ""
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your AccessFlow API key"
echo "2. Run tests: npm test"
echo "3. View reports: npx playwright show-report"
echo ""
echo "For detailed documentation, see:"
echo "  - ACCESSFLOW-SETUP.md"
echo "  - README.md"
echo ""
