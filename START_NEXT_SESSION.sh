#!/bin/bash

# 🚀 Quick Start Script for Next Session
# FlipCars Admin Dashboard Deployment Continuation

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   FlipCars Admin Dashboard - Next Session Quick Start    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Navigate to project
cd /home/user/webapp

echo "📍 Current Directory: $(pwd)"
echo ""

# Check git status
echo "📊 Git Status:"
git log --oneline -3
echo ""

# Check if vercel.json was removed
echo "🔍 Vercel Configuration:"
if [ -f "vercel.json" ]; then
    echo "⚠️  WARNING: Root vercel.json still exists!"
else
    echo "✅ Root vercel.json removed (correct)"
fi

if [ -f "frontend-admin/vercel.json" ]; then
    echo "✅ frontend-admin/vercel.json exists"
else
    echo "❌ ERROR: frontend-admin/vercel.json missing!"
fi
echo ""

# Check car angle images
echo "🖼️  Car Angle Images:"
if [ -d "frontend-admin/public/images/car-angles" ]; then
    image_count=$(ls frontend-admin/public/images/car-angles/*.jpg 2>/dev/null | wc -l)
    echo "✅ Found $image_count car angle images"
    ls -lh frontend-admin/public/images/car-angles/*.jpg 2>/dev/null || true
else
    echo "❌ ERROR: Car angles directory missing!"
fi
echo ""

# Check background processes
echo "🔄 Background Processes:"
if pgrep -f "npm run dev" > /dev/null; then
    echo "⚠️  Dev server still running (PID: $(pgrep -f 'npm run dev'))"
    echo "   You may want to kill it when deployment is complete"
else
    echo "✅ No dev server running"
fi
echo ""

# Environment check
echo "🌍 Environment:"
cd frontend-admin
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
    if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
        api_url=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d= -f2)
        echo "   API URL: $api_url"
    fi
else
    echo "⚠️  .env.local not found (Vercel will use env vars)"
fi
cd ..
echo ""

# Next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  CHECK VERCEL DEPLOYMENT:"
echo "   Open: https://vercel.com/charles-marques-projects/frontend-admin"
echo "   Look for commit: d9e26145"
echo "   Status should be: 🟢 Ready"
echo ""
echo "2️⃣  IF DEPLOYMENT SUCCEEDED:"
echo "   → Configure domain: admin.flipcars.us"
echo "   → Add CNAME: admin → cname.vercel-dns.com"
echo "   → Test estimate form"
echo ""
echo "3️⃣  IF DEPLOYMENT FAILED:"
echo "   → Check deployment logs"
echo "   → Copy error message"
echo "   → Fix and redeploy"
echo ""
echo "4️⃣  READ DETAILED CHECKLIST:"
echo "   cat /home/user/webapp/NEXT_SESSION_CHECKLIST.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Quick commands
echo "💡 QUICK COMMANDS:"
echo ""
echo "# View deployment checklist"
echo "cat NEXT_SESSION_CHECKLIST.md | less"
echo ""
echo "# Check git commits"
echo "git log --oneline -5"
echo ""
echo "# Test build locally"
echo "cd frontend-admin && npm run build"
echo ""
echo "# Push new changes"
echo "git add . && git commit -m 'fix: description' && git push origin main"
echo ""
echo "# Kill dev server (when done)"
echo "kill $(pgrep -f 'npm run dev')"
echo ""

echo "🚀 Ready to continue! Good luck! 🎉"
