import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScannerHeader } from '@/components/ui/scanner-header';

interface CrackedIP {
  ip: string;
  port: string;
  username: string;
  password: string;
  timestamp: string;
}

export default function CrackedPage() {
  const [crackedEntries, setCrackedEntries] = useState<CrackedIP[]>([]);
  const [lastFetchedLength, setLastFetchedLength] = useState(0);

  // Fetch cracked IPs
  const { data: initialData, isLoading, error } = useQuery<CrackedIP[], Error>({
    queryKey: ['/api/cracked'],
    queryFn: async () => {
      const response = await fetch('/api/cracked');
      if (!response.ok) throw new Error('Failed to fetch cracked IPs');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Set initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setCrackedEntries(initialData);
      setLastFetchedLength(initialData.length);
    }
  }, [initialData]);

  // Poll for new cracked IPs every second
  useEffect(() => {
    const fetchNewEntries = async () => {
      try {
        const response = await fetch('/api/cracked');
        if (!response.ok) throw new Error('Failed to fetch cracked IPs');
        const data: CrackedIP[] = await response.json();
        const newLength = data.length;

        if (newLength > lastFetchedLength) {
          // Add new entries to the list
          const newEntries = data.slice(lastFetchedLength);
          setCrackedEntries((prev) => [...prev, ...newEntries]);
          setLastFetchedLength(newLength);
        }
      } catch (error) {
        console.error('Error fetching cracked data:', error);
      }
    };

    const interval = setInterval(fetchNewEntries, 1000);
    return () => clearInterval(interval);
  }, [lastFetchedLength]);

  if (isLoading) {
    return (
      <div className="min-h-screen text-white font-mono bg-[#0a1929]">
        <ScannerHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="h-12 w-12 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white font-mono bg-[#0a1929]">
        <ScannerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#ff3e3e]/30 text-center">
            <h2 className="text-[#ff3e3e] text-xl mb-4">Error Loading Data</h2>
            <p className="text-gray-300 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1a1a1a] border border-[#00ff41] text-[#00ff41] px-4 py-2 rounded hover:bg-[#00ff41] hover:text-[#1a1a1a]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-mono bg-[#0a1929]">
      <ScannerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative min-h-[80vh] bg-[#0a1929] border border-[#00ff41]/30 rounded-lg overflow-hidden p-4">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background grid effect */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px), radial-gradient(rgba(0, 255, 65, 0.15) 1px, transparent 1px)',
                backgroundSize: '30px 30px, 90px 90px',
                backgroundPosition: '0 0, 15px 15px',
              }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-2px bg-[rgba(0,255,65,0.2)] animate-[scanline_5s_linear_infinite]"></div>
          </div>

          {/* Cracked 2000 logo */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold text-[#00ff41] tracking-wider mb-1"
              style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}
            >
              Angry Pie
            </h1>
            <p className="text-sm text-[#00ff41]/70">LIVE SSH CRACKING</p>
          </div>

          {/* Cracked IPs List */}
          <div className="relative z-10 mt-20">
            {crackedEntries.length === 0 ? (
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#00ff41]/30 text-center">
                <h2 className="text-[#00ff41] text-xl mb-4">No Cracked IPs Yet</h2>
                <p className="text-gray-300">Waiting for cracked SSH credentials...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {crackedEntries.map((entry) => (
                  <div
                    key={`${entry.ip}:${entry.port}:${entry.timestamp}`}
                    className="cracked-box animate-[fadeInPop_0.4s_ease-out_forwards]"
                  >
                    <div className="cracked-header p-2 border-b border-[#00ff41]/30 bg-[#2a2a2a] flex items-center">
                      <div className="h-3 w-3 bg-[#00ff41] rounded-full mr-2 animate-pulse"></div>
                      <span>{entry.ip}:{entry.port}</span>
                    </div>
                    <div className="p-4 text-sm space-y-2">
                      <div>
                        <span className="text-gray-400">Username:</span>{' '}
                        <span className="text-[#00ff41]">{entry.username}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Password:</span>{' '}
                        <span className="text-[#00ff41]">{entry.password}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Cracked At:</span>{' '}
                        <span className="text-[#00ff41]">{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}