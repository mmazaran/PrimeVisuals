import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueDetailed } from './components/ValueDetailed';
import { SocialProof } from './components/SocialProof';
import { CTA } from './components/CTA';
import { Services } from './components/Services';
import { CaseStudies } from './components/CaseStudies';
import { About } from './components/About';
import { ClientNotifications } from './components/ClientNotifications';
import { WebsiteServices } from './components/WebsiteServices';
import { Bookings } from './components/Bookings';
import { Checkout } from './components/Checkout';

// Declare the custom element to satisfy TypeScript/JSX


import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simple scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-prime-500/30">
      {/* Global Mouse Glow */}
      <div
        className="glow-point fixed pointer-events-none z-50 mix-blend-screen opacity-50 hidden md:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <BackgroundEffects />

      <div className="relative z-10">
        <Navbar />

        <main className="flex flex-col items-center w-full overflow-hidden min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={
              <>
                <Hero />
                <ValueDetailed />
                <SocialProof />
                <ClientNotifications />
                <CTA />
              </>
            } />
            <Route path="/Services" element={<Services />} />
            <Route path="/CaseStudies" element={<CaseStudies />} />
            <Route path="/WebsiteServices" element={<WebsiteServices />} />
            <Route path="/AboutUs" element={<About />} />
            <Route path="/Bookings" element={<Bookings />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Navigate to="/Home" replace />} />
          </Routes>
        </main>

        <footer className="w-full py-12 px-6 border-t border-white/5 mt-auto bg-black/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img
                src="/images/logo/PrimeVisualsTPBG.png"
                alt="Prime Visuals"
                className="h-6 w-auto opacity-80"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-gray-300 font-medium">Prime Visuals</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Prime Visuals. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* @ts-ignore */}
      <elevenlabs-convai agent-id="agent_1801kfhexxhney4bhdyevqsrvz84"></elevenlabs-convai>
      <Analytics />
    </div>
  );
};

export default App;