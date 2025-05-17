import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScannerHeader } from '@/components/ui/scanner-header';
import { EnrichedCard } from '@/components/ui/enriched-card';
import { EnrichedIP } from '@/lib/types';

export default function EnrichedPage() {
  const [currentEntry, setCurrentEntry] = useState<EnrichedIP | null>(null);
  const [queue, setQueue] = useState<EnrichedIP[]>([]);
  const [noChangeCount, setNoChangeCount] = useState(0);
  const [lastFetchedLength, setLastFetchedLength] = useState(0);
  const [countdown, setCountdown] = useState(5); // 5-second countdown
  const [visible, setVisible] = useState(true); // For pop-in/pop-out animation

  // Fetch the initial latest enriched IP
  const { 
    data: initialData, 
    isLoading, 
    error,
  } = useQuery<EnrichedIP | null, Error>({ 
    queryKey: ['/api/enriched/latest'],
    refetchOnWindowFocus: false,
  });

  // Set the initial data when it loads
  useEffect(() => {
    if (initialData && !currentEntry) {
      setCurrentEntry(initialData);
      setLastFetchedLength(1);
      setVisible(true);
    }
  }, [initialData, currentEntry]);

  // Fetch new enriched data every second
  useEffect(() => {
    const fetchNewEntries = async () => {
      try {
        const response = await fetch('/api/enriched');
        const data: EnrichedIP[] = await response.json();
        const newLength = data.length;

        if (newLength > lastFetchedLength) {
          // Add new entries to the queue
          const newEntries = data.slice(lastFetchedLength);
          setQueue((prev) => [...prev, ...newEntries]);
          setLastFetchedLength(newLength);

          // If this is the first fetch, set the current entry to the latest one
          if (!currentEntry && newEntries.length > 0) {
            setCurrentEntry(newEntries[newEntries.length - 1]);
            setVisible(true);
          }
        }
      } catch (error) {
        console.error('Error fetching enriched data:', error);
      }
    };

    const interval = setInterval(fetchNewEntries, 1000);
    return () => clearInterval(interval);
  }, [lastFetchedLength, currentEntry]);

  // Cycle through entries every 6 seconds and manage countdown
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      if (queue.length > 0) {
        // Trigger pop-out animation before changing the entry
        setVisible(false);
        setTimeout(() => {
          setCurrentEntry(queue[0]);
          setQueue((prev) => prev.slice(1));
          setNoChangeCount(0); // Reset no change counter
          setCountdown(5); // Reset countdown
          setVisible(true); // Trigger pop-in animation for the new entry
        }, 400); // Match the popIn animation duration (0.4s)
      } else {
        // No new data, increment no change counter
        setNoChangeCount((prev) => prev + 1);
        setCountdown(5); // Reset countdown even if no new data
      }
    }, 6000); // 6 seconds

    // Countdown timer updates every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(cycleInterval);
      clearInterval(countdownInterval);
    };
  }, [queue]);

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

  if (!currentEntry) {
    return (
      <div className="min-h-screen text-white font-mono bg-[#0a1929]">
        <ScannerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#00ff41]/30 text-center">
            <h2 className="text-[#00ff41] text-xl mb-4">No Enriched Data Available</h2>
            <p className="text-gray-300">Waiting for enriched data to be generated...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-mono bg-[#0a1929]">
      <ScannerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative min-h-[80vh] flex items-center justify-center bg-[#0a1929] border border-[#00ff41]/30 rounded-lg overflow-hidden p-4">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background grid effect */}
            <div className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px), radial-gradient(rgba(0, 255, 65, 0.15) 1px, transparent 1px)',
                backgroundSize: '30px 30px, 90px 90px',
                backgroundPosition: '0 0, 15px 15px'
              }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-2px bg-[rgba(0,255,65,0.2)] animate-[scanline_5s_linear_infinite]"></div>
          </div>

          {/* Beauty Pie logo */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <h1 
              className="text-3xl md:text-4xl font-bold text-[#00ff41] tracking-wider mb-1" 
              style={{textShadow: '0 0 10px rgba(0, 255, 65, 0.8)'}}
            >
              Beauty Pie
            </h1>
            <p className="text-sm text-[#00ff41]/70">LIVE INTERNET MONITORING</p>
          </div>

          {/* Enriched IP Card with Countdown and No Change Counter */}
          <div className="relative w-full max-w-2xl">
            <div className="absolute top-[-30px] right-0 flex items-center space-x-2">
              {noChangeCount > 0 && (
                <span className="text-gray-400 text-xs italic">
                  (no change x{noChangeCount})
                </span>
              )}
              <span className="text-gray-400 text-xs">Next in: {countdown}s</span>
            </div>
            <EnrichedCard
              data={{
                ...currentEntry,
                id: currentEntry.id || generateRandomId(), // Ensure Shodan ID is present
                organization: currentEntry.organization === 'N/A' ? 'Unknown' : currentEntry.organization,
                country: currentEntry.country === 'N/A' ? 'Unknown' : currentEntry.country,
                banner: currentEntry.banner === 'N/A' ? 'No banner information available' : currentEntry.banner,
                hostname: currentEntry.hostname === 'N/A' || currentEntry.hostname === 'error fetching' ? 'Unknown hostname' : currentEntry.hostname,
              }}
              visible={visible}
              className={noChangeCount > 0 ? 'border-[#ff3e3e]/50' : ''} // Highlight border if no change
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate a Shodan-like ID
function generateRandomId() {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomStr = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SH${dateStr}-${randomStr}`;
}