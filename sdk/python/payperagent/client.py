import time
from typing import Optional, Dict, Any, List, Callable
import requests
from eth_account import Account
from eth_account.messages import encode_defunct
from .utils import format_usdc, truncate_address


class RequestMetrics:
    """Metrics for tracking request performance"""
    def __init__(self):
        self.start_time = time.time()
        self.end_time: Optional[float] = None
        self.duration: Optional[float] = None
        self.cached = False
        self.retries = 0
        self.payment_required = False


class PayPerAgentClient:
    """
    Advanced client for interacting with PayPerAgent API Gateway
    
    Features:
    - Automatic payment handling with retry logic
    - Request metrics and monitoring
    - Beautiful error messages with emojis
    - Debug logging
    - Event callbacks
    """
    
    def __init__(
        self,
        gateway_url: str,
        private_key: Optional[str] = None,
        auto_retry: bool = True,
        max_retries: int = 3,
        timeout: int = 10,
        debug: bool = False,
        on_payment: Optional[Callable[[str, str], None]] = None,
        on_error: Optional[Callable[[Exception], None]] = None
    ):
        """
        Initialize PayPerAgent client
        
        Args:
            gateway_url: URL of the PayPerAgent gateway
            private_key: Private key for signing payments (optional)
            auto_retry: Automatically retry with payment on 402 (default: True)
            max_retries: Maximum number of retry attempts (default: 3)
            timeout: Request timeout in seconds (default: 10)
            debug: Enable debug logging (default: False)
            on_payment: Callback when payment is made (optional)
            on_error: Callback when error occurs (optional)
        """
        self.gateway_url = gateway_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'PayPerAgent-SDK-Python/0.1.0',
            'Accept': 'application/json',
        })
        self.account = Account.from_key(private_key) if private_key else None
        self.auto_retry = auto_retry
        self.max_retries = max_retries
        self.timeout = timeout
        self.debug = debug
        self.on_payment = on_payment
        self.on_error = on_error
        self.metrics: Dict[str, RequestMetrics] = {}
        
        if self.debug:
            self._log('✨ PayPerAgent SDK initialized', {
                'gateway': gateway_url,
                'wallet': truncate_address(self.account.address) if self.account else None,
                'auto_retry': auto_retry,
            })
    
    def _log(self, message: str, data: Any = None) -> None:
        """Log debug messages"""
        if self.debug:
            print(f"[PayPerAgent] {message}", data if data else '')
    
    def __enter__(self):
        """Context manager entry"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.session.close()
        return False
    
    def _generate_payment_proof(self, amount: str, description: str) -> str:
        """Generate payment proof for a request"""
        if not self.account:
            raise ValueError("💳 Wallet not configured. Cannot generate payment proof.")
        
        self._log(f"💰 Generating payment proof", {'amount': amount, 'description': description})
        
        timestamp = str(int(time.time() * 1000))
        message = f"{timestamp}:{amount}:{description}"
        
        # Sign message
        message_hash = encode_defunct(text=message)
        signed_message = self.account.sign_message(message_hash)
        signature = signed_message.signature.hex()
        
        if self.on_payment:
            self.on_payment(amount, description)
        
        self._log(f"✅ Payment proof generated", {
            'signer': truncate_address(self.account.address),
            'amount': format_usdc(float(amount)),
        })
        
        return f"{signature}:{timestamp}:{amount}"
    
    def _enhance_error(self, error: requests.HTTPError) -> Exception:
        """Enhance error messages with helpful information"""
        if error.response is not None:
            status = error.response.status_code
            try:
                data = error.response.json()
            except:
                data = {}
            
            if status == 402:
                return Exception(
                    f"💳 Payment Required: {data.get('payment', {}).get('amount')} USDC for "
                    f"{data.get('payment', {}).get('description')}. "
                    f"Configure a wallet to enable automatic payments."
                )
            elif status == 429:
                return Exception(
                    f"⏱️  Rate Limit Exceeded: {data.get('error', 'Too many requests')}. "
                    f"Please try again later."
                )
            elif status == 400:
                return Exception(
                    f"❌ Invalid Request: {data.get('error', 'Bad request')}. "
                    f"Check your parameters."
                )
        
        return error
    
    def _request_with_payment(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a request with automatic payment handling and retry logic"""
        url = f"{self.gateway_url}{endpoint}"
        request_id = f"{endpoint}-{int(time.time() * 1000)}"
        metrics = RequestMetrics()
        
        self._log(f"🚀 Request started", {'endpoint': endpoint, 'params': params})
        
        for attempt in range(self.max_retries + 1):
            try:
                # Try without payment first
                response = self.session.get(url, params=params, timeout=self.timeout)
                response.raise_for_status()
                
                metrics.end_time = time.time()
                metrics.duration = metrics.end_time - metrics.start_time
                metrics.cached = response.headers.get('x-cache-hit') == 'true'
                self.metrics[request_id] = metrics
                
                self._log(f"✅ Request successful", {
                    'duration': f"{metrics.duration * 1000:.0f}ms",
                    'cached': metrics.cached,
                    'retries': metrics.retries,
                })
                
                return response.json()['data']
                
            except requests.HTTPError as e:
                if e.response.status_code == 402 and self.auto_retry and self.account and attempt < self.max_retries:
                    metrics.payment_required = True
                    metrics.retries += 1
                    
                    self._log(f"💳 Payment required (attempt {attempt + 1}/{self.max_retries})", {
                        'amount': e.response.json().get('payment', {}).get('amount'),
                    })
                    
                    # Payment required - generate proof and retry
                    payment_info = e.response.json()['payment']
                    payment_proof = self._generate_payment_proof(
                        payment_info['amount'],
                        payment_info['description']
                    )
                    
                    headers = {'X-PAYMENT': payment_proof}
                    retry_response = self.session.get(url, params=params, headers=headers, timeout=self.timeout)
                    retry_response.raise_for_status()
                    
                    metrics.end_time = time.time()
                    metrics.duration = metrics.end_time - metrics.start_time
                    self.metrics[request_id] = metrics
                    
                    self._log(f"✅ Request successful after payment", {
                        'duration': f"{metrics.duration * 1000:.0f}ms",
                        'retries': metrics.retries,
                    })
                    
                    return retry_response.json()['data']
                
                # Handle other errors
                enhanced_error = self._enhance_error(e)
                if self.on_error:
                    self.on_error(enhanced_error)
                self._log(f"❌ Request failed", {'error': str(enhanced_error)})
                raise enhanced_error
        
        raise Exception(f"Max retries ({self.max_retries}) exceeded")
    
    def get_weather(
        self,
        city: Optional[str] = None,
        lat: Optional[str] = None,
        lon: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get weather data for a city or coordinates
        
        Args:
            city: City name
            lat: Latitude
            lon: Longitude
            
        Returns:
            Weather data dictionary
        """
        params = {}
        if city:
            params['city'] = city
        if lat and lon:
            params['lat'] = lat
            params['lon'] = lon
        
        return self._request_with_payment('/api/weather', params)
    
    def get_crypto(
        self,
        symbol: Optional[str] = None,
        symbols: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get cryptocurrency prices
        
        Args:
            symbol: Single symbol (e.g., 'BTCUSDT')
            symbols: Comma-separated symbols
            
        Returns:
            Crypto price data dictionary
        """
        params = {}
        if symbol:
            params['symbol'] = symbol
        if symbols:
            params['symbols'] = symbols
        
        return self._request_with_payment('/api/crypto', params)
    
    def get_news(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        country: Optional[str] = None,
        page_size: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Get news articles
        
        Args:
            query: Search query
            category: News category
            country: Country code
            page_size: Number of articles
            
        Returns:
            News data dictionary with articles
        """
        params = {}
        if query:
            params['query'] = query
        if category:
            params['category'] = category
        if country:
            params['country'] = country
        if page_size:
            params['pageSize'] = page_size
        
        return self._request_with_payment('/api/news', params)
    
    def get_gateway_info(self) -> Dict[str, Any]:
        """Get gateway information"""
        response = self.session.get(f"{self.gateway_url}/api")
        response.raise_for_status()
        return response.json()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get gateway statistics"""
        response = self.session.get(f"{self.gateway_url}/stats")
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        """Health check"""
        response = self.session.get(f"{self.gateway_url}/health", timeout=self.timeout)
        response.raise_for_status()
        return response.json()
    
    def get_metrics(self) -> Dict[str, RequestMetrics]:
        """Get request metrics for debugging and monitoring"""
        return self.metrics
    
    def clear_metrics(self) -> None:
        """Clear metrics history"""
        self.metrics.clear()
        self._log('🧹 Metrics cleared')


def create_client(
    gateway_url: str,
    private_key: Optional[str] = None,
    auto_retry: bool = True
) -> PayPerAgentClient:
    """
    Create a new PayPerAgent client
    
    Args:
        gateway_url: URL of the PayPerAgent gateway
        private_key: Private key for signing payments (optional)
        auto_retry: Automatically retry with payment on 402 (default: True)
        
    Returns:
        PayPerAgentClient instance
    """
    return PayPerAgentClient(gateway_url, private_key, auto_retry)
