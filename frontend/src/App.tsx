import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import ParticleBackground from './components/ParticleBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Explanation from './components/Explanation';
import LiveData from './components/LiveData';
import LiveCrypto from './components/LiveCrypto';
import SystemStatus from './components/SystemStatus';
import Analytics from './components/Analytics';
import Leaderboard from './components/Leaderboard';
import SkaleEcosystem from './components/SkaleEcosystem';
import ApiExplorer from './components/ApiExplorer';
import PricingCalculator from './components/PricingCalculator';
import UseCases from './components/UseCases';
import Features from './components/Features';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <div className="min-h-screen bg-gradient-to-b from-black via-void-950 to-black text-white">
            <ParticleBackground />
            <Navigation />
            <Hero />
            <Explanation />
            <LiveData />
            <LiveCrypto />
            <div className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
              <SystemStatus />
            </div>
            <Analytics />
            <Leaderboard />
            <SkaleEcosystem />
            <div id="apis">
              <ApiExplorer />
            </div>
            <UseCases />
            <div id="pricing">
              <PricingCalculator />
            </div>
            <Features />
            <Footer />
          </div>
        </WebSocketProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
