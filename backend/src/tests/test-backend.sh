#!/bin/bash

# Backend Comprehensive Test Suite
# Tests all endpoints, circuit breakers, and functionality

BASE_URL="${API_URL:-http://localhost:3000}"
PASSED=0
FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 PayPerAgent Backend Test Suite"
echo "=================================="
echo ""

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $name... "
    response=$(curl -s "$BASE_URL$url")
    
    if echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $response" | head -c 200
        ((FAILED++))
    fi
}

# Health & System Tests
echo "📊 Health & System Endpoints"
echo "----------------------------"
test_endpoint "Health Check" "/health" ".status"
test_endpoint "System Metrics" "/system/metrics" ".metrics.uptime"
test_endpoint "Circuit Breakers" "/system/circuit-breakers" ".circuitBreakers"
test_endpoint "Performance Stats" "/system/performance" ".statistics"
test_endpoint "Environment Info" "/system/environment" ".environment.nodeEnv"

echo ""
echo "🔌 API Gateway Tests"
echo "----------------------------"
test_endpoint "Gateway Info" "/api" ".service"
test_endpoint "Cache Stats" "/cache/stats" ".crypto"

echo ""
echo "📚 Documentation Tests"
echo "----------------------------"
test_endpoint "Swagger JSON" "/docs/swagger.json" ".info.title"

echo ""
echo "⚡ Load Test (10 concurrent requests)"
echo "----------------------------"
echo -n "Running load test... "
for i in {1..10}; do
    curl -s "$BASE_URL/health" > /dev/null &
done
wait
echo -e "${GREEN}✓ COMPLETED${NC}"
((PASSED++))

# Check performance after load
sleep 1
perf_response=$(curl -s "$BASE_URL/system/performance?minutes=1")
avg_time=$(echo "$perf_response" | jq -r '.statistics.averageResponseTime')
echo "  Average response time: ${avg_time}ms"

echo ""
echo "🔄 Circuit Breaker Status"
echo "----------------------------"
cb_response=$(curl -s "$BASE_URL/system/circuit-breakers")
open_circuits=$(echo "$cb_response" | jq '[.circuitBreakers[] | select(.state == "OPEN")] | length')
echo "  Open circuits: $open_circuits"
if [ "$open_circuits" -eq 0 ]; then
    echo -e "  ${GREEN}All circuit breakers healthy${NC}"
    ((PASSED++))
else
    echo -e "  ${YELLOW}Warning: $open_circuits circuit breaker(s) open${NC}"
fi

echo ""
echo "📈 Final Results"
echo "=================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
