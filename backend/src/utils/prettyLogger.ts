/**
 * Beautiful console logging with colors and formatting
 */

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

export class PrettyLogger {
  static success(message: string, data?: any): void {
    console.log(`${colors.green}✓${colors.reset} ${colors.bright}${message}${colors.reset}`, data || '');
  }

  static error(message: string, error?: any): void {
    console.log(`${colors.red}✗${colors.reset} ${colors.bright}${message}${colors.reset}`);
    if (error) {
      console.log(`${colors.dim}${error}${colors.reset}`);
    }
  }

  static warning(message: string, data?: any): void {
    console.log(`${colors.yellow}⚠${colors.reset} ${colors.bright}${message}${colors.reset}`, data || '');
  }

  static info(message: string, data?: any): void {
    console.log(`${colors.cyan}ℹ${colors.reset} ${message}`, data || '');
  }

  static request(method: string, path: string, status: number, duration: number): void {
    const statusColor = status < 300 ? colors.green : status < 400 ? colors.cyan : status < 500 ? colors.yellow : colors.red;
    const methodColor = method === 'GET' ? colors.blue : method === 'POST' ? colors.green : method === 'PUT' ? colors.yellow : colors.red;
    
    console.log(
      `${methodColor}${method.padEnd(6)}${colors.reset} ${path.padEnd(30)} ${statusColor}${status}${colors.reset} ${colors.dim}${duration}ms${colors.reset}`
    );
  }

  static payment(amount: string, description: string, address: string): void {
    console.log(`${colors.magenta}💰 Payment${colors.reset} ${colors.bright}${amount} USDC${colors.reset} ${colors.dim}from ${address.slice(0, 8)}...${colors.reset}`);
    console.log(`${colors.dim}   ${description}${colors.reset}`);
  }

  static cache(type: 'hit' | 'miss' | 'set', cacheType: string, key: string): void {
    if (type === 'hit') {
      console.log(`${colors.green}⚡ Cache HIT${colors.reset} ${colors.cyan}${cacheType}${colors.reset} ${colors.dim}${key}${colors.reset}`);
    } else if (type === 'miss') {
      console.log(`${colors.yellow}○ Cache MISS${colors.reset} ${colors.cyan}${cacheType}${colors.reset} ${colors.dim}${key}${colors.reset}`);
    } else {
      console.log(`${colors.blue}💾 Cache SET${colors.reset} ${colors.cyan}${cacheType}${colors.reset} ${colors.dim}${key}${colors.reset}`);
    }
  }

  static database(operation: string, table: string, duration: number): void {
    console.log(`${colors.magenta}🗄️  DB ${operation}${colors.reset} ${colors.cyan}${table}${colors.reset} ${colors.dim}${duration}ms${colors.reset}`);
  }

  static banner(): void {
    console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${colors.bright}██████╗  █████╗ ██╗   ██╗██████╗ ███████╗██████╗${colors.reset}${colors.cyan}    ║
║   ${colors.bright}██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗${colors.reset}${colors.cyan}   ║
║   ${colors.bright}██████╔╝███████║ ╚████╔╝ ██████╔╝█████╗  ██████╔╝${colors.reset}${colors.cyan}   ║
║   ${colors.bright}██╔═══╝ ██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗${colors.reset}${colors.cyan}   ║
║   ${colors.bright}██║     ██║  ██║   ██║   ██║     ███████╗██║  ██║${colors.reset}${colors.cyan}   ║
║   ${colors.bright}╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝${colors.reset}${colors.cyan}   ║
║                                                           ║
║              ${colors.bright}${colors.magenta}AI Agent API Gateway${colors.reset}${colors.cyan}                      ║
║           ${colors.dim}Zero Gas Fees • SKALE Network${colors.reset}${colors.cyan}              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`);
  }

  static section(title: string): void {
    console.log(`\n${colors.bright}${colors.cyan}▶ ${title}${colors.reset}`);
    console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`);
  }

  static metric(label: string, value: string | number, unit?: string): void {
    console.log(`  ${colors.dim}${label}:${colors.reset} ${colors.bright}${value}${colors.reset}${unit ? colors.dim + ' ' + unit + colors.reset : ''}`);
  }
}
