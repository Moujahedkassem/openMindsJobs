#!/usr/bin/env pwsh

Write-Host "🚀 Starting Playwright Tests for OpenMindsAI" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Playwright is installed
if (-not (Test-Path "node_modules/@playwright/test")) {
    Write-Host "❌ Error: Playwright not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -D @playwright/test" -ForegroundColor Yellow
    exit 1
}

# Check if dev server is running
$devServerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $devServerRunning = $true
    }
} catch {
    $devServerRunning = $false
}

if (-not $devServerRunning) {
    Write-Host "⚠️  Development server not running on port 5173" -ForegroundColor Yellow
    Write-Host "   Starting dev server..." -ForegroundColor Yellow
    
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm run dev" -WindowStyle Minimized
    
    Write-Host "   Waiting for dev server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check again
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Development server is now running" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start development server" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Failed to start development server" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Development server is already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "🧪 Running Playwright Tests..." -ForegroundColor Cyan
Write-Host ""

# Run the tests
try {
    npx playwright test
    $exitCode = $LASTEXITCODE
} catch {
    Write-Host "❌ Error running tests: $_" -ForegroundColor Red
    $exitCode = 1
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green

if ($exitCode -eq 0) {
    Write-Host "🎉 All tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Check the output above for details." -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Run 'npx playwright test --ui' for interactive mode" -ForegroundColor Gray
Write-Host "   - Run 'npx playwright test --headed' to see browser windows" -ForegroundColor Gray
Write-Host "   - Check 'tests/README.md' for more options" -ForegroundColor Gray

exit $exitCode
