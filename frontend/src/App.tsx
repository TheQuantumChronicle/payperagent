import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ParticleBackground from './components/ParticleBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Explanation from './components/Explanation';
import LiveData from './components/LiveData';
import ApiExplorer from './components/ApiExplorer';
import PricingCalculator from './components/PricingCalculator';
import UseCases from './components/UseCases';
import Features from './components/Features';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-black via-void-950 to-black text-white">
        <ParticleBackground />
        <Navigation />
        <Hero />
        <Explanation />
        <LiveData />
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
    </QueryClientProvider>
  );
}

export default App;
