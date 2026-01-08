#!/bin/bash

echo "🧪 COMPREHENSIVE API TESTING - PayPerAgent on SKALE Network"
echo "============================================================"
echo ""

BASE_URL="http://localhost:3000"
PAYMENT_HEADER="X-PAYMENT: test"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

# Test function
test_api() {
    local name=$1
    local endpoint=$2
    local expected_field=$3
    
    test_count=$((test_count + 1))
    echo -e "${BLUE}Testing:${NC} $name"
    
    response=$(curl -s -H "$PAYMENT_HEADER" "$BASE_URL$endpoint")
    
    if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC} - $name"
        pass_count=$((pass_count + 1))
        echo "$response" | jq -c "{$expected_field: .$expected_field}" | head -c 100
        echo ""
    else
        echo -e "${RED}❌ FAIL${NC} - $name"
        fail_count=$((fail_count + 1))
        echo "$response" | jq '.' | head -20
    fi
    echo ""
}

echo "📊 PART 1: PUBLIC APIs (Should return real data)"
echo "================================================"
echo ""

test_api "CoinGecko - Crypto Prices" "/api/coingecko?per_page=2" "data"
test_api "Wikipedia - Search" "/api/wikipedia/search?query=blockchain" "results"
test_api "Reddit - Posts" "/api/reddit?subreddit=cryptocurrency&limit=2" "posts"
test_api "GitHub - Search" "/api/github/search?query=skale&per_page=2" "repos"
test_api "Exchange Rates" "/api/exchange/rates?base=USD&symbols=EUR" "rates"
test_api "HackerNews" "/api/utilities/hackernews?limit=2" "stories"
test_api "Random Dog" "/api/utilities/random/dog" "url"

echo ""
echo "🔗 PART 2: SKALE BLOCKCHAIN APIs"
echo "================================="
echo ""

test_api "Ruby.Exchange - Token Price" "/api/ruby/price?token=SKL&pair=USDC" "blockNumber"
test_api "Ruby.Exchange - Liquidity" "/api/ruby/liquidity?pool=SKL-USDC" "blockNumber"
test_api "Ruby.Exchange - Swap Quote" "/api/ruby/quote?fromToken=SKL&toToken=USDC&amount=100" "blockNumber"
test_api "Ruby.Exchange - Top Pairs" "/api/ruby/pairs?limit=3" "blockNumber"

echo ""
echo "🏆 PART 3: REPUTATION SYSTEM"
echo "============================="
echo ""

test_api "Reputation Tiers" "/api/reputation/tiers" "tiers"
test_api "Supported Tokens" "/api/reputation/tokens" "tokens"
test_api "Leaderboard" "/api/reputation/leaderboard?limit=5" "leaderboard"

echo ""
echo "⚠️  PART 4: SKALE ECOSYSTEM (Expected to show proper errors)"
echo "============================================================="
echo ""

echo -e "${BLUE}Testing:${NC} Chirper.ai - Trending"
chirper_response=$(curl -s -H "$PAYMENT_HEADER" "$BASE_URL/api/chirper/trending?limit=3")
if echo "$chirper_response" | jq -e '.error' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC} - Properly returns error (no mock data)"
    echo "$chirper_response" | jq -c '{success, error}' | head -c 100
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Should return error"
    fail_count=$((fail_count + 1))
fi
test_count=$((test_count + 1))
echo ""

echo -e "${BLUE}Testing:${NC} Gaming - Overview"
gaming_response=$(curl -s -H "$PAYMENT_HEADER" "$BASE_URL/api/gaming/overview")
if echo "$gaming_response" | jq -e '.totalGames' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC} - Returns gaming overview data"
    echo "$gaming_response" | jq -c '{totalGames, totalPlayers}' | head -c 100
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Should return gaming data"
    fail_count=$((fail_count + 1))
fi
test_count=$((test_count + 1))
echo ""

echo ""
echo "📈 TEST SUMMARY"
echo "==============="
echo -e "Total Tests: $test_count"
echo -e "${GREEN}Passed: $pass_count${NC}"
echo -e "${RED}Failed: $fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    exit 1
fi
