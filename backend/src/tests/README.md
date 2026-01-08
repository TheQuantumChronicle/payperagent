# Backend Tests

All test files for the PayPerAgent backend.

## Test Files

### Shell Scripts
- **test-backend.sh** - Main backend integration test suite
- **test-all-apis.sh** - Comprehensive API endpoint tests

### JavaScript Tests
- **test-db-connection.js** - PostgreSQL database connection tests
- **test-websocket.js** - WebSocket server functionality tests

### TypeScript Tests
- **test-skale-blockchain.ts** - SKALE blockchain integration tests
- **test-skale-connection.ts** - SKALE network connection tests

## Running Tests

From the backend directory:

```bash
# Run main backend tests
./src/tests/test-backend.sh

# Run all API tests
./src/tests/test-all-apis.sh

# Run database tests
node src/tests/test-db-connection.js

# Run WebSocket tests
node src/tests/test-websocket.js

# Run SKALE tests
npx tsx src/tests/test-skale-blockchain.ts
npx tsx src/tests/test-skale-connection.ts
```

## Test Coverage

- ✅ 29 API endpoints
- ✅ Database connectivity
- ✅ WebSocket real-time updates
- ✅ SKALE blockchain integration
- ✅ Circuit breakers
- ✅ Performance monitoring
- ✅ Error handling
