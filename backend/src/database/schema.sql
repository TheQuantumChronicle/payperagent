-- PayPerAgent Database Schema

-- Analytics table for tracking all API requests
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER NOT NULL,
    agent_id VARCHAR(255),
    ip_address VARCHAR(45),
    payment_amount DECIMAL(10, 6),
    cached BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_endpoint ON analytics(endpoint);
CREATE INDEX IF NOT EXISTS idx_analytics_agent_id ON analytics(agent_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Cache table for persistent caching across restarts
CREATE TABLE IF NOT EXISTS cache (
    id SERIAL PRIMARY KEY,
    cache_key VARCHAR(512) NOT NULL UNIQUE,
    cache_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cache_key ON cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_type ON cache(cache_type);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(255),
    wallet_address VARCHAR(42) NOT NULL,
    amount DECIMAL(10, 6) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USDC',
    endpoint VARCHAR(255) NOT NULL,
    description TEXT,
    signature TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_wallet ON payments(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payments_timestamp ON payments(timestamp);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    limit_type VARCHAR(50) NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP NOT NULL,
    window_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, limit_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_end);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(12, 2) NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);

-- API usage statistics (aggregated data)
CREATE TABLE IF NOT EXISTS usage_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    total_requests INTEGER NOT NULL DEFAULT 0,
    successful_requests INTEGER NOT NULL DEFAULT 0,
    failed_requests INTEGER NOT NULL DEFAULT 0,
    total_revenue DECIMAL(12, 6) NOT NULL DEFAULT 0,
    avg_response_time INTEGER NOT NULL DEFAULT 0,
    unique_agents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(date, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_usage_stats_date ON usage_stats(date);
CREATE INDEX IF NOT EXISTS idx_usage_stats_endpoint ON usage_stats(endpoint);

-- Cleanup old data function
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
    -- Delete analytics older than 30 days
    DELETE FROM analytics WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete expired cache entries
    DELETE FROM cache WHERE expires_at < NOW();
    
    -- Delete old rate limit records
    DELETE FROM rate_limits WHERE window_end < NOW() - INTERVAL '1 day';
    
    -- Delete old system metrics (keep 7 days)
    DELETE FROM system_metrics WHERE timestamp < NOW() - INTERVAL '7 days';
    
    RAISE NOTICE 'Cleanup completed';
END;
$$ LANGUAGE plpgsql;
