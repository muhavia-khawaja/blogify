@echo off
REM Quick verification checklist for blog enhancements

echo.
echo 🔍 Blog Enhancement Verification Checklist
echo ==========================================
echo.

REM Check 1: Node modules
echo ✓ Checking Node modules...
if exist "node_modules" (
  echo   ✅ node_modules exists
) else (
  echo   ❌ node_modules missing - run 'npm install'
)

REM Check 2: Environment file
echo.
echo ✓ Checking .env file...
if exist ".env" (
  findstr /M "JWT_SECRET" .env >nul
  if %ERRORLEVEL% equ 0 (
    findstr /M "DATABASE_URL" .env >nul
    if %ERRORLEVEL% equ 0 (
      echo   ✅ .env configured correctly
    ) else (
      echo   ⚠️  Missing DATABASE_URL in .env
    )
  ) else (
    echo   ⚠️  Missing JWT_SECRET in .env
  )
) else (
  echo   ❌ .env file not found
)

REM Check 3: Key files exist
echo.
echo ✓ Checking new files...

if exist "app\(frontend)\login\page.tsx" (
  echo   ✅ login page exists
) else (
  echo   ❌ login page missing
)

if exist "app\(frontend)\signup\page.tsx" (
  echo   ✅ signup page exists
) else (
  echo   ❌ signup page missing
)

if exist "app\(frontend)\profile\page.tsx" (
  echo   ✅ profile page exists
) else (
  echo   ❌ profile page missing
)

if exist "components\BlogInteraction.tsx" (
  echo   ✅ BlogInteraction component exists
) else (
  echo   ❌ BlogInteraction component missing
)

REM Check 4: Prisma
echo.
echo ✓ Checking Prisma...
if exist "prisma\schema.prisma" (
  echo   ✅ Prisma schema exists
  findstr /M "model User" prisma\schema.prisma >nul
  if %ERRORLEVEL% equ 0 (
    echo   ✅ User model found in schema
  ) else (
    echo   ❌ User model missing from schema
  )
) else (
  echo   ❌ Prisma schema missing
)

echo.
echo ==========================================
echo Setup Complete! 🎉
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo 3. Try: Sign up → /signup
echo 4. Try: Login → /login
echo 5. Try: Blog interactions → /blog/[slug]
echo.
echo Documentation:
echo - Read ENHANCEMENT_GUIDE.md for full details
echo.
