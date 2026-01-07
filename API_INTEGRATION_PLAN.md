# PayPerAgent - API Integration Plan

## 🎯 Currently Integrated APIs

1. **Weather** - OpenWeatherMap (0.001 USDC)
2. **Crypto** - Binance (0.002 USDC)
3. **News** - NewsAPI (0.005 USDC)

---

## 🚀 Priority APIs to Add (Free Tier Available)

### **Tier 1: High Value for AI Agents**

#### 1. **Perplexity API** (You have access!)
- **What:** Real-time web search with AI-powered answers
- **Why:** Perfect for AI agents needing current information
- **Pricing:** 0.01 USDC per request
- **Use Cases:** Research, fact-checking, real-time Q&A
- **Endpoint:** `/api/perplexity`
- **Free Tier:** 5 requests/day (then paid)

#### 2. **CoinGecko** (Free - No Auth)
- **What:** Comprehensive crypto data (prices, market cap, volume)
- **Why:** Better than Binance for market data
- **Pricing:** FREE (keep as 0.001 USDC)
- **Endpoint:** `/api/crypto/market`
- **API:** `https://api.coingecko.com/api/v3/coins/markets`

#### 3. **Open-Meteo** (Free - No Auth)
- **What:** Weather data without API key
- **Why:** Backup for OpenWeatherMap, more locations
- **Pricing:** FREE (0.001 USDC)
- **Endpoint:** `/api/weather/forecast`
- **API:** `https://api.open-meteo.com/v1/forecast`

#### 4. **Wikipedia API** (Free - No Auth)
- **What:** Access to all Wikipedia content
- **Why:** Knowledge base for AI agents
- **Pricing:** 0.002 USDC
- **Endpoint:** `/api/wikipedia`
- **API:** `https://en.wikipedia.org/w/api.php`

#### 5. **GitHub API** (Free - No Auth for public data)
- **What:** Repository info, trending repos, user data
- **Why:** Developer tools, code search
- **Pricing:** 0.003 USDC
- **Endpoint:** `/api/github`
- **API:** `https://api.github.com`

---

### **Tier 2: Entertainment & Media**

#### 6. **Reddit API** (Free - No Auth)
- **What:** Subreddit posts, trending topics
- **Why:** Social sentiment, trending discussions
- **Pricing:** 0.002 USDC
- **Endpoint:** `/api/reddit`
- **API:** `https://www.reddit.com/r/{subreddit}/top.json`

#### 7. **HackerNews API** (Free - No Auth)
- **What:** Tech news, trending stories
- **Why:** Tech community insights
- **Pricing:** 0.001 USDC
- **Endpoint:** `/api/hackernews`
- **API:** `https://hacker-news.firebaseio.com/v0`

#### 8. **Random Dog/Cat/Fox** (Free - No Auth)
- **What:** Random animal images
- **Why:** Fun, testing, placeholders
- **Pricing:** 0.0005 USDC
- **Endpoint:** `/api/random/animal`
- **APIs:** Multiple sources

---

### **Tier 3: Data & Utilities**

#### 9. **IP Geolocation** (Free - No Auth)
- **What:** IP address location data
- **Why:** User location, analytics
- **Pricing:** 0.001 USDC
- **Endpoint:** `/api/ip/lookup`
- **API:** `https://ipapi.co/{ip}/json`

#### 10. **QR Code Generator** (Free - No Auth)
- **What:** Generate QR codes
- **Why:** Useful utility for agents
- **Pricing:** 0.0005 USDC
- **Endpoint:** `/api/qr/generate`
- **API:** `https://api.qrserver.com/v1/create-qr-code`

#### 11. **Currency Exchange** (Free - No Auth)
- **What:** Real-time exchange rates
- **Why:** Financial calculations
- **Pricing:** 0.001 USDC
- **Endpoint:** `/api/exchange`
- **API:** `https://open.er-api.com/v6/latest/USD`

#### 12. **Public Holidays** (Free - No Auth)
- **What:** Holiday data by country
- **Why:** Calendar features
- **Pricing:** 0.0005 USDC
- **Endpoint:** `/api/holidays`
- **API:** `https://date.nager.at/api/v2/publicholidays`

---

### **Tier 4: Advanced (Requires API Key)**

#### 13. **Hugging Face** (Free Tier)
- **What:** AI models (embeddings, classification, generation)
- **Why:** AI-powered features
- **Pricing:** 0.01 USDC
- **Endpoint:** `/api/ai/inference`

#### 14. **Wolfram Alpha** (Free Tier)
- **What:** Computational knowledge
- **Why:** Math, science, calculations
- **Pricing:** 0.005 USDC
- **Endpoint:** `/api/compute`

#### 15. **Google Maps** (Free Tier)
- **What:** Geocoding, places, directions
- **Why:** Location services
- **Pricing:** 0.003 USDC
- **Endpoint:** `/api/maps`

---

## 📊 Recommended Implementation Order

### **Phase 1 (This Week)**
1. ✅ Perplexity API (you have access)
2. ✅ CoinGecko (no auth needed)
3. ✅ Wikipedia (no auth needed)

### **Phase 2 (Next Week)**
4. Reddit API
5. GitHub API
6. Currency Exchange

### **Phase 3 (Future)**
7. Hugging Face
8. More specialized APIs

---

## 💰 Updated Pricing Structure

| API | Price (USDC) | Free Tier | Auth Required |
|-----|--------------|-----------|---------------|
| Weather (OpenWeatherMap) | 0.001 | ❌ | ✅ |
| Weather (Open-Meteo) | 0.001 | ✅ | ❌ |
| Crypto (Binance) | 0.002 | ✅ | ❌ |
| Crypto (CoinGecko) | 0.001 | ✅ | ❌ |
| News (NewsAPI) | 0.005 | Limited | ✅ |
| **Perplexity Search** | 0.010 | Limited | ✅ |
| **Wikipedia** | 0.002 | ✅ | ❌ |
| **GitHub** | 0.003 | ✅ | ❌ |
| **Reddit** | 0.002 | ✅ | ❌ |
| **HackerNews** | 0.001 | ✅ | ❌ |
| **Currency Exchange** | 0.001 | ✅ | ❌ |
| **IP Lookup** | 0.001 | ✅ | ❌ |
| **QR Generator** | 0.0005 | ✅ | ❌ |
| **Holidays** | 0.0005 | ✅ | ❌ |

---

## 🎯 Why These APIs?

### **For AI Agents:**
- **Perplexity:** Real-time web search with AI answers
- **Wikipedia:** Knowledge base
- **GitHub:** Code search and repository info
- **Reddit/HackerNews:** Social sentiment and trends

### **For Developers:**
- **CoinGecko:** Better crypto data than Binance
- **Currency Exchange:** Financial calculations
- **IP Lookup:** User analytics
- **QR Generator:** Utility functions

### **Monetization:**
- Mix of free (no auth) and paid APIs
- Free APIs = lower pricing = more volume
- Premium APIs (Perplexity) = higher pricing = better margins

---

## 🚀 Next Steps

1. **Add Perplexity API** (you have access)
2. **Add 3-5 no-auth APIs** (quick wins)
3. **Update documentation**
4. **Test all endpoints**
5. **Deploy to Railway**

---

## 📝 Notes

- **Free APIs** = No rate limits to worry about
- **No Auth APIs** = Easier for users
- **Mix pricing** = Attract more users with cheap options
- **Premium APIs** = Higher value, higher pricing
