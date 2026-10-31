# ============================================================
# ISOURCE — Safe Development Server Starter
# Run this script instead of `npm run dev` to prevent cache errors.
# ============================================================
Write-Host "🛑 Killing stuck Node processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "🧹 Clearing .next cache..." -ForegroundColor Cyan
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev