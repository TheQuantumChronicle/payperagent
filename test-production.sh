#!/bin/bash

# PayPerAgent Production Test Suite
# Tests all critical endpoints and functionality

API_URL="${API_URL:-https://payperagent.xyz}"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PayPerAgent Production Test Suite                       ║${NC}"
echo -e "${BLUE}║   Testing: $API_URL${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local check_field="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $name... "
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        if [ -n "$check_field" ]; then
            if echo "$body" | jq -e "$check_field" > /dev/null 2>&1; then
                echo -e "${GREEN}✓ PASS${NC}"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo -e "${RED}✗ FAIL${NC} (missing field: $check_field)"
                FAILED_TESTS=$((FAILED_TESTS + 1))
            fi
        else
            echo -e "${GREEN}✓ PASS${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (expected $expected_status, got $status_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo -e "${YELLOW}━━━ System Health Tests ━━━${NC}"
test_endpoint "Health Check" "$API_URL/health" "200" ".status"
test_endpoint "Database Connection" "$API_URL/health" "200" ".database.connected"
test_endpoint "Circuit Breakers" "$API_URL/health" "200" ".externalServices.circuitBreakers"

echo ""
echo -e "${YELLOW}━━━ Gateway Tests ━━━${NC}"
test_endpoint "Gateway Info" "$API_URL/api" "200" ".service"
test_endpoint "API Version" "$API_URL/api" "200" ".version"
test_endpoint "Endpoints List" "$API_URL/api" "200" ".endpoints"

echo ""
echo -e "${YELLOW}━━━ Analytics Tests ━━━${NC}"
test_endpoint "Usage Stats" "$API_URL/analytics/usage" "200" ".overview"
test_endpoint "Gateway Stats" "$API_URL/stats" "200" ".overview"
test_endpoint "Circuit Breaker Status" "$API_URL/system/circuit-breakers" "200" ".circuitBreakers"

echo ""
echo -e "${YELLOW}━━━ Payment System Tests (Expecting 402) ━━━${NC}"
test_endpoint "Weather API (402)" "$API_URL/api/weather?city=London" "402" ".payment"
test_endpoint "Crypto API (402)" "$API_URL/api/crypto?symbol=BTCUSDT" "402" ".payment"
test_endpoint "News API (402)" "$API_URL/api/news?category=technology&pageSize=3" "402" ".payment"

echo ""
echo -e "${YELLOW}━━━ Reputation System Tests ━━━${NC}"
test_endpoint "Reputation Tiers" "$API_URL/api/reputation/tiers" "200" ".tiers"
test_endpoint "Leaderboard" "$API_URL/api/reputation/leaderboard?limit=5" "200" ".success"
test_endpoint "Supported Tokens" "$API_URL/api/reputation/tokens" "200" ".tokens"

echo ""
echo -e "${YELLOW}━━━ SKALE Ecosystem Tests (Expecting 402) ━━━${NC}"
test_endpoint "Ruby Exchange (402)" "$API_URL/api/ruby/price?token=RUBY" "402" ".payment"
test_endpoint "Chirper AI (402)" "$API_URL/api/chirper/trending" "402" ".payment"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Test Results                                             ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║   Total Tests:  $TOTAL_TESTS                                          ║${NC}"
echo -e "${BLUE}║   ${GREEN}Passed:      $PASSED_TESTS${BLUE}                                          ║${NC}"
echo -e "${BLUE}║   ${RED}Failed:      $FAILED_TESTS${BLUE}                                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Production is ready!${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please review the errors above.${NC}\n"
    exit 1
fi
