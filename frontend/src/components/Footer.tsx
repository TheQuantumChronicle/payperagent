import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-8 px-4 border-t border-void-500/10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-sm">
              © 2026 PayPerAgent
            </p>
            <a
              href="https://github.com/TheQuantumChronicle/payperagent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-void-300 transition-colors duration-300"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
          
          <motion.a
            href="https://intym.xyz"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 group"
          >
            <span className="text-[10px] text-gray-600">Built by</span>
            <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center overflow-hidden border border-void-500/20">
              <img 
                src="/intym-logo.png?v=2" 
                alt="InTym Labs" 
                className="w-8 h-8 object-contain"
                style={{  
                  filter: 'brightness(1.8) contrast(1.5) drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))',
                  transform: 'scale(1.4)',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
            <span className="text-[11px] text-void-300 font-medium group-hover:text-void-200 transition-colors">
              InTym Labs
            </span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
