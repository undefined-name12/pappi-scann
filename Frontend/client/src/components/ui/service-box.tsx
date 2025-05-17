import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Button } from './button';
import { X } from 'lucide-react';
import { IP } from '@/lib/types';
import { getServiceColor } from '@/lib/service-colors';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from './confirmation-dialog';

interface ServiceBoxProps {
  serviceName: string;
  port: string;
  ips: IP[];
  onServiceDeleted: () => void;
}

export function ServiceBox({ serviceName, port, ips, onServiceDeleted }: ServiceBoxProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prevIpsLength, setPrevIpsLength] = useState(0);
  const [newIpIndexes, setNewIpIndexes] = useState<number[]>([]);
  const ipsEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const colors = getServiceColor(serviceName);
  
  // Track new IPs for animation and auto-scroll
  useEffect(() => {
    if (ips.length > prevIpsLength) {
      // Only mark the new IPs for animation (last entries are the new ones)
      const newCount = ips.length - prevIpsLength;
      const newIndexes = Array.from({ length: newCount }, (_, i) => ips.length - 1 - i);
      setNewIpIndexes(newIndexes);
      
      // Auto-scroll to new content
      if (ipsEndRef.current) {
        const scrollContainer = ipsEndRef.current.closest('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
      
      // Clear animation flags after they've played
      setTimeout(() => {
        setNewIpIndexes([]);
      }, 1000);
    }
    setPrevIpsLength(ips.length);
  }, [ips.length, prevIpsLength]);
  
  const openConfirmDialog = () => {
    setIsConfirmOpen(true);
  };
  
  const closeConfirmDialog = () => {
    setIsConfirmOpen(false);
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await apiRequest('DELETE', `/api/services/${port}`, undefined);
      toast({
        title: 'Service deleted',
        description: `${serviceName} (Port: ${port}) has been removed.`,
      });
      onServiceDeleted();
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      closeConfirmDialog();
    }
  };

  return (
    <>
      <Card className={`bg-[#1a1a1a] ${colors.border} overflow-hidden shadow-lg animate-[fadeIn_0.5s_ease-out_forwards]`}>
        <CardHeader className="p-3 border-b border-inherit bg-[#2a2a2a] grid grid-cols-2 items-center">
          <div className="flex items-center">
            <div className={`h-2 w-2 ${colors.dot} rounded-full mr-2 animate-pulse`}></div>
            <span className={`font-medium ${colors.text}`}>{serviceName}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400">Port: {port}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-400 hover:text-[#ff3e3e]"
              onClick={openConfirmDialog}
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Delete service</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {ips.length > 0 ? (
            <div className="max-h-48 overflow-y-auto scrollbar-custom">
              <table className="w-full text-sm">
                <tbody>
                  {ips.map((ip, index) => (
                    <tr 
                      key={`${ip.ip}:${ip.port}-${index}`}
                      className={`border-b border-[#2a2a2a] last:border-b-0 ${newIpIndexes.includes(index) ? 'animate-[flipIn_0.4s_ease-out_forwards]' : ''}`}
                    >
                      <td className="py-2">
                        <span className={colors.text}>{ip.ip}:{ip.port}</span>
                      </td>
                      <td className="py-2 text-right">
                        <span className="text-xs text-gray-400">
                          {ip.timestamp ? new Date(ip.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                          }) : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* This div is for auto-scrolling to the newest entries */}
              <div ref={ipsEndRef} />
            </div>
          ) : (
            <div className="text-center py-2 text-gray-400 text-sm">No IPs available</div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete the ${serviceName} service (Port: ${port})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </>
  );
}
