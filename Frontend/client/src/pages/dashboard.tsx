import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScannerHeader } from '@/components/ui/scanner-header';
import { DataDisplay } from '@/components/ui/data-display';
import { ServiceBox } from '@/components/ui/service-box';
import { AddServiceForm } from '@/components/ui/add-service-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { IP, Service } from '@/lib/types';

export default function Dashboard() {
  const [isAddServiceFormOpen, setIsAddServiceFormOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query for all IPs
  const { 
    data: allIPs = [], 
    isLoading: allIPsLoading, 
    error: allIPsError 
  } = useQuery<IP[], Error>({ 
    queryKey: ['/api/all'],
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    select: (data) => [...data],
  });

  // Query for services
  const { 
    data: services = [], 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useQuery<Service[], Error>({ 
    queryKey: ['/api/services'],
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    select: (data) => [...data],
  });

  // Queries for classified IPs for each service
  const servicesWithIPs = useQuery<Record<string, IP[]>, Error>({
    queryKey: ['/api/classified'],
    refetchInterval: 1000,
    enabled: services.length > 0,
    refetchOnWindowFocus: false,
    select: (data) => ({ ...data }),
  });

  const handleServiceAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/services'] });
  };

  const handleServiceDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/services'] });
  };

  return (
    <div className="min-h-screen text-white font-mono bg-[#0a1929]">
      <ScannerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* All IPs Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#00ff41] flex items-center">
            <span className="h-2 w-2 bg-[#00ff41] rounded-full mr-2 animate-pulse"></span>
            Live IPs Monitor
          </h2>
          
          <DataDisplay
            title="Latest discovered IPs (all.txt)"
            data={allIPs}
            loading={allIPsLoading}
            error={allIPsError?.message || null}
            limit={10}
          />
        </div>
        
        {/* Classified IPs Grid Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#00ff41] flex items-center">
              <span className="h-2 w-2 bg-[#00ff41] rounded-full mr-2 animate-pulse"></span>
              Classified IPs
            </h2>
            
            <Button
              className="text-sm bg-[#1a1a1a] border border-[#00ff41] text-[#00ff41] px-4 py-2 rounded-md hover:bg-[#00ff41] hover:text-[#1a1a1a] transition-colors"
              onClick={() => setIsAddServiceFormOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          <AddServiceForm
            isOpen={isAddServiceFormOpen}
            onClose={() => setIsAddServiceFormOpen(false)}
            onServiceAdded={handleServiceAdded}
          />
          
          {servicesError ? (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#ff3e3e]/30 text-[#ff3e3e]">
              Error loading services: {servicesError.message}
            </div>
          ) : servicesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#00ff41]/30 text-center">
              <p className="text-gray-400 mb-4">No services configured yet.</p>
              <Button
                className="bg-[#00ff41] text-[#1a1a1a] hover:bg-opacity-80"
                onClick={() => setIsAddServiceFormOpen(true)}
              >
                Add Your First Service
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <ServiceBox
                  key={`${service.port}-${service.service}`}
                  serviceName={service.service}
                  port={service.port}
                  ips={servicesWithIPs.data?.[service.service.toLowerCase()] || []}
                  onServiceDeleted={handleServiceDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}