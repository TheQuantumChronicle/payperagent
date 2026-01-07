"""PayPerAgent Python SDK"""

from .client import PayPerAgentClient, create_client, RequestMetrics
from .utils import (
    format_usdc,
    format_duration,
    is_valid_address,
    truncate_address,
    format_crypto_price,
    format_price_change,
    pretty_print,
    ProgressIndicator,
)

__version__ = "0.1.0"
__all__ = [
    "PayPerAgentClient",
    "create_client",
    "RequestMetrics",
    "format_usdc",
    "format_duration",
    "is_valid_address",
    "truncate_address",
    "format_crypto_price",
    "format_price_change",
    "pretty_print",
    "ProgressIndicator",
]
