"""Utility functions for PayPerAgent Python SDK"""

from typing import Any, Dict
import json


def format_usdc(amount: float) -> str:
    """Format USDC amount for display"""
    return f"${amount:.4f} USDC"


def format_duration(ms: int) -> str:
    """Format duration in milliseconds to human-readable string"""
    if ms < 1000:
        return f"{ms}ms"
    if ms < 60000:
        return f"{ms / 1000:.2f}s"
    return f"{ms / 60000:.2f}m"


def is_valid_address(address: str) -> bool:
    """Validate Ethereum address"""
    if not address.startswith('0x'):
        return False
    if len(address) != 42:
        return False
    try:
        int(address[2:], 16)
        return True
    except ValueError:
        return False


def truncate_address(address: str) -> str:
    """Truncate address for display"""
    if not is_valid_address(address):
        return address
    return f"{address[:6]}...{address[-4:]}"


def format_crypto_price(price: float) -> str:
    """Format crypto price with appropriate decimals"""
    if price >= 1000:
        return f"${price:,.2f}"
    if price >= 1:
        return f"${price:.4f}"
    return f"${price:.8f}"


def format_price_change(change: float) -> str:
    """Calculate percentage change with color indicator"""
    symbol = '▲' if change >= 0 else '▼'
    color = '🟢' if change >= 0 else '🔴'
    return f"{color} {symbol} {abs(change):.2f}%"


def pretty_print(data: Any) -> None:
    """Pretty print JSON with indentation"""
    print(json.dumps(data, indent=2))


class ProgressIndicator:
    """Simple progress indicator for terminal"""
    
    def __init__(self, message: str):
        self.message = message
        self.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        self.current_frame = 0
        
    def __enter__(self):
        print(f"⏳ {self.message}...", end='', flush=True)
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            print(f"\r✅ {self.message}    ")
        else:
            print(f"\r❌ {self.message}    ")
        return False
