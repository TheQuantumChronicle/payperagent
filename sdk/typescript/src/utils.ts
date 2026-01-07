/**
 * Utility functions for PayPerAgent SDK
 */

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `$${num.toFixed(4)} USDC`;
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format crypto price with appropriate decimals
 */
export function formatCryptoPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
}

/**
 * Calculate percentage change with color indicator
 */
export function formatPriceChange(change: number): string {
  const symbol = change >= 0 ? '▲' : '▼';
  const color = change >= 0 ? '🟢' : '🔴';
  return `${color} ${symbol} ${Math.abs(change).toFixed(2)}%`;
}

/**
 * Pretty print JSON with colors (for terminal output)
 */
export function prettyPrint(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Create a progress indicator
 */
export class ProgressIndicator {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval?: NodeJS.Timeout;
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  start(): void {
    this.interval = setInterval(() => {
      process.stdout.write(`\r${this.frames[this.currentFrame]} ${this.message}`);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);
  }

  stop(finalMessage?: string): void {
    if (this.interval) {
      clearInterval(this.interval);
      process.stdout.write(`\r${finalMessage || '✓ ' + this.message}\n`);
    }
  }
}
