import { EnrichedIP } from '@/lib/types';
import { Card, CardContent } from './card';

interface EnrichedCardProps {
  data: EnrichedIP;
  className?: string;
  visible: boolean;
}

export function EnrichedCard({ data, className = '', visible }: EnrichedCardProps) {
  if (!visible) return null;

  return (
    <Card 
      className={`shodan-card w-full max-w-2xl bg-[#1a1a1a]/90 border border-[#00ff41]/50 rounded-lg shadow-lg p-6 z-10 ${visible ? 'animate-[popOut_0.6s_ease-out_forwards]' : 'animate-[popIn_0.4s_ease-out_forwards]'} ${className} relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-[#00ff41] rounded-full mr-2 animate-pulse"></div>
            <h2 className="text-xl font-bold text-[#00ff41]">{data.ip}</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {data.hostname === 'N/A' || data.hostname === 'error fetching' ? 'Unknown hostname' : data.hostname}
          </p>
        </div>
        <div className="px-3 py-1 bg-[#00ff41]/10 rounded-md border border-[#00ff41]/20">
          <span className="text-[#00ff41] font-mono text-sm">{data.port}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Organization</h3>
          <p className="text-white">{data.organization === 'N/A' ? 'Unknown' : data.organization}</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Country</h3>
          <p className="text-white">{data.country === 'N/A' ? 'Unknown' : data.country}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Banner</h3>
        <div className="mt-2 p-3 bg-[#2a2a2a] rounded-md border border-[#00ff41]/20 font-mono text-sm text-[#00ff41] overflow-x-auto">
          <code>{data.banner === 'N/A' ? 'No banner information available' : data.banner}</code>
        </div>
      </div>
      
      <div className="mt-5 border-t border-[#00ff41]/20 pt-4 flex items-center justify-between text-xs text-gray-400">
        <span>Discovered: {data.timestamp || new Date().toISOString()}</span>
        <span>Shodan ID: <span className="font-mono">{data.id || generateRandomId()}</span></span>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-px bg-[#00ff41] opacity-50"
          style={{
            boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)',
            animation: 'scanline 3s linear infinite'
          }}
        ></div>
      </div>
    </Card>
  );
}

// Helper function for demo purposes to generate a Shodan-like ID
function generateRandomId() {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomStr = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `SH${dateStr}-${randomStr}`;
}