#!/usr/bin/env node

/**
 * WebSocket Test Client
 * Tests real-time updates and subscriptions
 */

const WebSocket = require('ws');

const WS_URL = 'ws://localhost:3000/ws';
let testsPassed = 0;
let testsFailed = 0;

console.log('🔌 WebSocket Test Suite');
console.log('========================\n');

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✓ Connected to WebSocket server\n');
  testsPassed++;
  
  // Test 1: Connection message
  setTimeout(() => {
    console.log('Test 1: Subscribing to crypto channel...');
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'crypto',
      params: { symbols: 'BTCUSDT,ETHUSDT' }
    }));
  }, 500);
  
  // Test 2: Subscribe to system metrics
  setTimeout(() => {
    console.log('Test 2: Subscribing to system metrics...');
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'system'
    }));
  }, 1000);
  
  // Test 3: Identify as agent
  setTimeout(() => {
    console.log('Test 3: Identifying as test agent...');
    ws.send(JSON.stringify({
      type: 'identify',
      agentId: 'test-agent-001'
    }));
  }, 1500);
  
  // Close after tests
  setTimeout(() => {
    console.log('\n📊 Test Results:');
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 All WebSocket tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed');
      process.exit(1);
    }
  }, 8000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log(`\n📨 Received: ${message.type}`);
    
    switch (message.type) {
      case 'connected':
        console.log('  ✓ Connection confirmed');
        testsPassed++;
        break;
      
      case 'subscribed':
        console.log(`  ✓ Subscribed to ${message.channel}`);
        testsPassed++;
        break;
      
      case 'identified':
        console.log(`  ✓ Identified as ${message.agentId}`);
        testsPassed++;
        break;
      
      case 'crypto_update':
        console.log('  ✓ Received crypto price update');
        if (message.data) {
          const coins = Object.keys(message.data);
          console.log(`    Coins: ${coins.join(', ')}`);
          testsPassed++;
        }
        break;
      
      case 'system_metrics':
        console.log('  ✓ Received system metrics');
        if (message.data && message.data.memory) {
          console.log(`    Memory: ${message.data.memory.heapUsed}MB / ${message.data.memory.heapTotal}MB`);
          console.log(`    Connections: ${message.data.connections}`);
          testsPassed++;
        }
        break;
      
      default:
        console.log(`  Unknown message type: ${message.type}`);
    }
  } catch (error) {
    console.error('  ✗ Error parsing message:', error.message);
    testsFailed++;
  }
});

ws.on('error', (error) => {
  console.error('✗ WebSocket error:', error.message);
  testsFailed++;
  process.exit(1);
});

ws.on('close', () => {
  console.log('\n🔌 WebSocket connection closed');
});
