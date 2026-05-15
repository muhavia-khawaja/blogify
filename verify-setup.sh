#!/bin/bash
# Quick verification checklist for blog enhancements

echo "🔍 Blog Enhancement Verification Checklist"
echo "=========================================="
echo ""

# Check 1: Node modules
echo "✓ Checking Node modules..."
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules exists"
else
  echo "  ❌ node_modules missing - run 'npm install'"
fi

# Check 2: Environment file
echo ""
echo "✓ Checking .env file..."
if [ -f ".env" ]; then
  if grep -q "JWT_SECRET" .env && grep -q "DATABASE_URL" .env; then
    echo "  ✅ .env configured correctly"
  else
    echo "  ⚠️  Missing JWT_SECRET or DATABASE_URL in .env"
  fi
else
  echo "  ❌ .env file not found"
fi

# Check 3: Key files exist
echo ""
echo "✓ Checking new files..."
files_to_check=(
  "app/(frontend)/login/page.tsx"
  "app/(frontend)/signup/page.tsx"
  "app/(frontend)/profile/page.tsx"
  "components/BlogInteraction.tsx"
)

for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file missing"
  fi
done

# Check 4: Build
echo ""
echo "✓ Checking build status..."
if npm run build > /dev/null 2>&1; then
  echo "  ✅ Build successful"
else
  echo "  ❌ Build failed - check console output"
fi

echo ""
echo "=========================================="
echo "Setup Complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Try: Sign up → /signup"
echo "4. Try: Login → /login"
echo "5. Try: Blog interactions → /blog/[slug]"
echo ""
