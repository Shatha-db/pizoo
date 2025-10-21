#!/bin/bash

# Pizoo Application Health Check Script
# This script checks if all services are running and configured properly

echo "🔍 Pizoo Application Health Check"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking Services Status"
echo "----------------------------"

# Check MongoDB
if supervisorctl status mongodb | grep -q "RUNNING"; then
    print_success "MongoDB is running"
else
    print_error "MongoDB is not running"
fi

# Check Backend
if supervisorctl status backend | grep -q "RUNNING"; then
    print_success "Backend is running"
else
    print_error "Backend is not running"
fi

# Check Frontend
if supervisorctl status frontend | grep -q "RUNNING"; then
    print_success "Frontend is running"
else
    print_error "Frontend is not running"
fi

echo ""
echo "2. Checking Configuration Files"
echo "--------------------------------"

# Check backend .env
if [ -f "/app/backend/.env" ]; then
    print_success "Backend .env file exists"
    
    # Check critical variables
    if grep -q "MONGO_URL" /app/backend/.env; then
        print_success "MONGO_URL is configured"
    else
        print_error "MONGO_URL is missing"
    fi
    
    if grep -q "JWT_SECRET" /app/backend/.env; then
        if grep -q "pizoo-secret-key-change-in-production" /app/backend/.env; then
            print_warning "JWT_SECRET is using default value - CHANGE IN PRODUCTION!"
        else
            print_success "JWT_SECRET is configured (custom value)"
        fi
    else
        print_error "JWT_SECRET is missing"
    fi
    
    if grep -q "CORS_ORIGINS=\"\*\"" /app/backend/.env; then
        print_warning "CORS is set to allow all origins (*) - RESTRICT IN PRODUCTION!"
    else
        print_success "CORS is configured with specific origins"
    fi
else
    print_error "Backend .env file is missing"
fi

# Check frontend .env
if [ -f "/app/frontend/.env" ]; then
    print_success "Frontend .env file exists"
    
    if grep -q "REACT_APP_BACKEND_URL" /app/frontend/.env; then
        print_success "REACT_APP_BACKEND_URL is configured"
    else
        print_error "REACT_APP_BACKEND_URL is missing"
    fi
else
    print_error "Frontend .env file is missing"
fi

echo ""
echo "3. Checking Database"
echo "--------------------"

# Check MongoDB connection and data
USER_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('pizoo_database').users.countDocuments({})" 2>/dev/null || echo "0")
if [ "$USER_COUNT" -gt 0 ]; then
    print_success "Database has $USER_COUNT users"
else
    print_warning "Database has no users - run seed script if needed"
fi

echo ""
echo "4. Checking Dependencies"
echo "------------------------"

# Check Python dependencies
if [ -f "/app/backend/requirements.txt" ]; then
    print_success "Backend requirements.txt exists"
else
    print_error "Backend requirements.txt is missing"
fi

# Check Node dependencies
if [ -d "/app/frontend/node_modules" ]; then
    print_success "Frontend node_modules exists"
else
    print_error "Frontend node_modules is missing - run 'yarn install'"
fi

echo ""
echo "5. Checking Mobile Configuration"
echo "---------------------------------"

# Check Capacitor config
if [ -f "/app/frontend/capacitor.config.ts" ]; then
    print_success "Capacitor config exists"
else
    print_error "Capacitor config is missing"
fi

# Check Android platform
if [ -d "/app/frontend/android" ]; then
    print_success "Android platform exists"
    
    # Check gradle wrapper
    if [ -f "/app/frontend/android/gradlew" ]; then
        print_success "Android gradlew exists"
    else
        print_error "Android gradlew is missing"
    fi
    
    if [ -f "/app/frontend/android/gradle/wrapper/gradle-wrapper.jar" ]; then
        print_success "gradle-wrapper.jar exists"
    else
        print_error "gradle-wrapper.jar is missing - see GRADLE_WRAPPER_FIX.md"
    fi
else
    print_warning "Android platform not configured"
fi

# Check iOS platform
if [ -d "/app/frontend/ios" ]; then
    print_success "iOS platform exists"
else
    print_warning "iOS platform not configured"
fi

echo ""
echo "6. Checking Documentation"
echo "-------------------------"

DOCS=("README.md" "PROJECT_STRUCTURE.md" "DEPLOYMENT.md" "QUICK_START.md")
for doc in "${DOCS[@]}"; do
    if [ -f "/app/$doc" ]; then
        print_success "$doc exists"
    else
        print_warning "$doc is missing"
    fi
done

echo ""
echo "7. Testing API Endpoints"
echo "------------------------"

# Get backend URL from frontend .env
BACKEND_URL=$(grep "REACT_APP_BACKEND_URL" /app/frontend/.env | cut -d'=' -f2)

if [ -n "$BACKEND_URL" ]; then
    # Test health/root endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/auth/me" -H "Authorization: Bearer invalid" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" == "401" ]; then
        print_success "API is responding (got 401 for invalid token as expected)"
    elif [ "$HTTP_CODE" == "000" ]; then
        print_error "Cannot connect to backend API at $BACKEND_URL"
    else
        print_warning "API returned unexpected status code: $HTTP_CODE"
    fi
else
    print_error "Cannot determine backend URL"
fi

echo ""
echo "=================================="
echo "Health Check Summary"
echo "=================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Health check FAILED${NC}"
    echo "Please fix the errors above before launching."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Health check PASSED with warnings${NC}"
    echo "Review the warnings above, especially for production deployment."
    exit 0
else
    echo -e "${GREEN}✅ Health check PASSED${NC}"
    echo "All systems are operational!"
    exit 0
fi
