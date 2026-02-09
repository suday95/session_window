#!/bin/bash
# Quick Start Checklist for Sessions Marketplace

echo "🚀 SESSIONS MARKETPLACE - SETUP CHECKLIST"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker to continue."
    exit 1
fi
echo "✅ Docker installed"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose to continue."
    exit 1
fi
echo "✅ Docker Compose installed"

# Verify project structure
echo ""
echo "📁 Verifying project structure..."

files_to_check=(
    "docker-compose.yml"
    "backend/requirements.txt"
    "backend/Dockerfile"
    "backend/config/settings.py"
    "backend/config/urls.py"
    "backend/users/models.py"
    "backend/sessions/models.py"
    "backend/bookings/models.py"
    "frontend/Dockerfile"
    "nginx/nginx.conf"
    ".env.example"
)

all_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        all_exist=false
    fi
done

echo ""
if [ "$all_exist" = true ]; then
    echo "✅ All required files are present!"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Copy .env.example to .env (if not already done)"
    echo "2. Run: docker-compose up --build"
    echo "3. Backend will be available at http://localhost:8000"
    echo "4. Frontend will be available at http://localhost:3000"
    echo "5. Proxy (Nginx) at http://localhost"
    echo ""
    echo "🔐 CREDENTIALS:"
    echo "Database: postgres / postgres123"
    echo "Database Name: sessionsdb"
    echo ""
    echo "✏️  TO CREATE SUPERUSER:"
    echo "docker-compose exec backend python manage.py createsuperuser"
    echo ""
else
    echo "❌ Some files are missing. Please check the setup."
fi
