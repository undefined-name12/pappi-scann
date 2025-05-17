import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog';

const formSchema = z.object({
  port: z.string().min(1, "Port is required"),
  service: z.string().min(1, "Service name is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AddServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded: () => void;
}

export function AddServiceForm({ isOpen, onClose, onServiceAdded }: AddServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      port: '',
      service: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await apiRequest('POST', '/api/services', data);
      toast({
        title: 'Service added',
        description: `${data.service} (Port: ${data.port}) has been added.`,
      });
      reset();
      onServiceAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add service:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add service. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1a1a1a] border border-[#00ff41]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#00ff41] text-lg font-medium">Add New Service</DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Configure a new service to monitor by specifying a port number and service name.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="port" className="block text-sm font-medium text-gray-300 mb-1">Port</Label>
              <Input
                id="port"
                {...register('port')}
                className="w-full bg-[#2a2a2a] border border-[#00ff41]/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50"
                placeholder="e.g. 8080"
              />
              {errors.port && (
                <p className="text-[#ff3e3e] text-xs mt-1">{errors.port.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="serviceName" className="block text-sm font-medium text-gray-300 mb-1">Service Name</Label>
              <Input
                id="serviceName"
                {...register('service')}
                className="w-full bg-[#2a2a2a] border border-[#00ff41]/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50"
                placeholder="e.g. HTTP-ALT"
              />
              {errors.service && (
                <p className="text-[#ff3e3e] text-xs mt-1">{errors.service.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="bg-[#1a1a1a]">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="mr-3 text-gray-300 hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#00ff41] text-[#1a1a1a] hover:bg-opacity-80 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
