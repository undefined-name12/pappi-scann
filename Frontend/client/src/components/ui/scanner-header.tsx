import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

export function ScannerHeader() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <nav className="bg-[#1a1a1a] border-b border-[#00ff41]/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-6 w-6 text-[#00ff41] mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 22 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 22V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 5L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 17L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 19L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 7L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[#00ff41] font-bold text-xl">Cutie Pie</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`${location === '/' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] border-transparent border-b-2 hover:border-[#00ff41]/50'} px-1 pt-1 inline-flex items-center text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link 
                href="/enriched" 
                className={`${location === '/enriched' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] border-transparent border-b-2 hover:border-[#00ff41]/50'} px-1 pt-1 inline-flex items-center text-sm font-medium`}
              >
                Beauty Pie
              </Link>
              <Link 
                href="/cracked" 
                className={`${location === '/cracked' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] border-transparent border-b-2 hover:border-[#00ff41]/50'} px-1 pt-1 inline-flex items-center text-sm font-medium`}
              >
                Angry Pie
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-[#00ff41] focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`${location === '/' ? 'text-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] hover:bg-[#2a2a2a]'} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Dashboard
            </Link>
            <Link 
              href="/enriched" 
              className={`${location === '/enriched' ? 'text-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] hover:bg-[#2a2a2a]'} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Beauty Pie
            </Link>
            <Link 
              href="/cracked" 
              className={`${location === '/cracked' ? 'text-[#00ff41]' : 'text-gray-300 hover:text-[#00ff41] hover:bg-[#2a2a2a]'} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Angry Pie
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}