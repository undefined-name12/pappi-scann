import { useState, useEffect } from 'react';
import { EnrichedIP } from '@/lib/types';
import { EnrichedCard } from './enriched-card';

interface EnrichedDisplayProps {
  initialData: EnrichedIP | null;
}

export function EnrichedDisplay({ initialData }: EnrichedDisplayProps) {
  const [currentEntry, setCurrentEntry] = useState<EnrichedIP | null>(initialData);
  const [queue, setQueue] = useState<EnrichedIP[]>([]);
  const [noChangeCount, setNoChangeCount] = useState(0);
  const [lastFetchedLength, setLastFetchedLength] = useState(initialData ? 1 : 0);
  const [visible, setVisible] = useState(true); // For pop-in/pop-out animation

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

  // Cycle through entries every 6 seconds with animation
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      if (queue.length > 0) {
        // Trigger pop-out animation before changing the entry
        setVisible(false);
        setTimeout(() => {
          setCurrentEntry(queue[0]);
          setQueue((prev) => prev.slice(1));
          setNoChangeCount(0); // Reset no change counter
          setVisible(true); // Trigger pop-in animation for the new entry
        }, 400); // Match the popIn animation duration (0.4s)
      } else {
        // No new data, increment no change counter
        setNoChangeCount((prev) => prev + 1);
      }
    }, 6000); // 6 seconds

    return () => clearInterval(cycleInterval);
  }, [queue]);

  if (!currentEntry) {
    return (
      <div className="w-full max-w-2xl bg-[#1a1a1a]/90 border border-[#00ff41]/50 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="h-3 w-3 bg-[#00ff41] rounded-full mr-2 animate-pulse"></div>
          <h2 className="text-xl font-bold text-[#00ff41]">No Enriched Data</h2>
        </div>
        <div className="text-gray-400 text-center text-sm">No enriched data available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
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
      {noChangeCount > 0 && (
        <div className="absolute top-2 right-2 text-gray-400 text-xs italic">
          (no change x{noChangeCount})
        </div>
      )}
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