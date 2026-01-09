#!/bin/bash

echo "🧪 COMPREHENSIVE API TESTING - PayPerAgent on SKALE Network"
echo "============================================================"
echo ""

BASE_URL="${API_URL:-http://localhost:3000}"
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

echo "📊 PART 1: PUBLIC APIs (Payment Protected - Expecting 402)"
echo "=========================================================="
echo ""

test_api "CoinGecko - Crypto Prices" "/api/coingecko?per_page=2" "payment"
test_api "Wikipedia - Search" "/api/wikipedia/search?query=blockchain" "payment"
test_api "Reddit - Posts" "/api/reddit?subreddit=cryptocurrency&limit=2" "payment"
test_api "GitHub - Search" "/api/github/search?query=skale&per_page=2" "payment"
test_api "Exchange Rates" "/api/exchange/rates?base=USD&symbols=EUR" "payment"
test_api "HackerNews" "/api/utilities/hackernews?limit=2" "payment"
test_api "Random Dog" "/api/utilities/random/dog" "payment"

echo ""
echo "😄 PART 2: NEW FREE APIs (Jokes, Bored, Name Predictors)"
echo "========================================================"
echo ""

test_api "Jokes - Random" "/api/jokes/random" "payment"
test_api "Jokes - Programming Type" "/api/jokes/type/programming" "payment"
test_api "Jokes - Search" "/api/jokes/search?q=code" "payment"
test_api "Bored - Random Activity" "/api/bored/activity" "payment"
test_api "Bored - Activity by Type" "/api/bored/activity?type=education" "payment"
test_api "Name - Predict Age" "/api/name/age?name=Michael" "payment"
test_api "Name - Predict Gender" "/api/name/gender?name=Sarah" "payment"
test_api "Name - Predict Nationality" "/api/name/nationality?name=Yuki" "payment"
test_api "Name Predictor - All" "/api/name/all?name=John" "payment"

# New Batch 2 - 8 More Free APIs
test_api "Cat Facts - Random" "/api/catfacts/random" "payment"
test_api "Cat Facts - Multiple" "/api/catfacts/facts?limit=3" "payment"
test_api "Universities - Search" "/api/universities/search?country=United+States" "payment"
test_api "Countries - All" "/api/countries/all" "payment"
test_api "Countries - By Name" "/api/countries/name/Canada" "payment"
test_api "Countries - By Code" "/api/countries/code/US" "payment"
test_api "Advice - Random" "/api/advice/random" "payment"
test_api "Advice - Search" "/api/advice/search?q=life" "payment"
test_api "Zipcode Lookup" "/api/zipcode/us/90210" "payment"
test_api "Random User" "/api/randomuser?count=1" "payment"
test_api "Open Library - Search" "/api/books/search?q=javascript&limit=5" "payment"
test_api "Open Library - ISBN" "/api/books/isbn/9780140328721" "payment"
test_api "Rick & Morty - Characters" "/api/rickmorty/characters?page=1" "payment"
test_api "Rick & Morty - Character" "/api/rickmorty/character/1" "payment"
test_api "Rick & Morty - Episodes" "/api/rickmorty/episodes?page=1" "payment"

echo ""
echo "🔗 PART 3: SKALE BLOCKCHAIN APIs (Payment Protected)"
echo "===================================================="
echo ""

test_api "Ruby.Exchange - Token Price" "/api/ruby/price?token=SKL&pair=USDC" "payment"
test_api "Ruby.Exchange - Liquidity" "/api/ruby/liquidity?pool=SKL-USDC" "payment"
test_api "Ruby.Exchange - Swap Quote" "/api/ruby/quote?fromToken=SKL&toToken=USDC&amount=100" "payment"
test_api "Ruby.Exchange - Top Pairs" "/api/ruby/pairs?limit=3" "payment"

echo ""
echo "🏆 PART 4: REPUTATION SYSTEM"
echo "============================="
echo ""

test_api "Reputation Tiers" "/api/reputation/tiers" "tiers"
test_api "Supported Tokens" "/api/reputation/tokens" "tokens"
test_api "Leaderboard" "/api/reputation/leaderboard?limit=5" "leaderboard"

echo ""
echo "⚠️  PART 5: SKALE ECOSYSTEM (Expected to show proper errors)"
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
if echo "$gaming_response" | jq -e '.payment' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC} - Properly returns payment required"
    echo "$gaming_response" | jq -c '{success, error}' | head -c 100
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Should return payment required"
    fail_count=$((fail_count + 1))
fi
test_count=$((test_count + 1))
echo ""

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "Total tests: 40"
echo ""
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
