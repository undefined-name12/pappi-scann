import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { IP } from '@/lib/types';

interface DataDisplayProps {
  title: string;
  data: IP[];
  loading: boolean;
  error: string | null;
  limit?: number;
  showTimestamp?: boolean;
  autoRefresh?: boolean;
}

export function DataDisplay({
  title,
  data,
  loading,
  error,
  limit = 10,
  showTimestamp = true,
  autoRefresh = true
}: DataDisplayProps) {
  const tableEndRef = useRef<HTMLDivElement>(null);
  const [prevDataLength, setPrevDataLength] = useState(0);
  const [newItemIndexes, setNewItemIndexes] = useState<number[]>([]);

  // Sort data by timestamp (just to be sure) and get the latest entries
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const limitedData = sortedData.slice(-limit); // Get the last `limit` entries (newest)

  // Track new entries for animation and auto-scroll
  useEffect(() => {
    if (data.length > prevDataLength) {
      // Only mark the new entries for animation (last entries in limitedData are the new ones)
      const newCount = data.length - prevDataLength;
      const newIndexes = Array.from({ length: Math.min(newCount, limit) }, (_, i) => limit - 1 - i);
      setNewItemIndexes(newIndexes);

      // Auto-scroll to new content
      if (tableEndRef.current) {
        const scrollContainer = tableEndRef.current.closest('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }

      // Clear animation flags after they've played
      setTimeout(() => {
        setNewItemIndexes([]);
      }, 1000);
    }
    setPrevDataLength(data.length);
  }, [data.length, prevDataLength, limit]);

  return (
    <Card className="bg-[#1a1a1a] border-[#00ff41]/30 shadow-lg overflow-hidden">
      <CardHeader className="p-4 border-b border-[#00ff41]/30 bg-[#2a2a2a] grid grid-cols-2 items-center">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-[#00ff41] rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center justify-end">
          {autoRefresh && <span className="text-xs text-gray-400">Auto-refreshing every 1s</span>}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 max-h-48 overflow-y-auto scrollbar-custom">
          {error ? (
            <div className="text-[#ff3e3e] text-center py-4">
              Error: {error}
            </div>
          ) : loading && data.length === 0 ? ( // Only show loading if no data yet
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : limitedData.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              No data available
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left">
                    <th className="pb-2">IP:Port</th>
                    {showTimestamp && <th className="pb-2">Timestamp</th>}
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {limitedData.map((item, index) => (
                    <tr 
                      key={`${item.ip}:${item.port}:${item.timestamp}`} // Use timestamp for uniqueness
                      className={`border-b border-[#2a2a2a] last:border-b-0 ${newItemIndexes.includes(index) ? 'animate-[flipIn_0.4s_ease-out_forwards]' : ''}`}
                    >
                      <td className="py-2 text-[#00ff41]">{item.ip}:{item.port}</td>
                      {showTimestamp && <td className="py-2 text-gray-400">{item.timestamp || 'Unknown'}</td>}
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full ${limitedData.length - index <= 3 ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-gray-500/20 text-gray-400'} text-xs`}>
                          {limitedData.length - index <= 3 ? 'New' : 'Processed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tableEndRef} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}