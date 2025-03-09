import React, { useState, useEffect } from 'react';
import { ClientMessage } from '../../lib/client-messages-db';
import { useServiceRequest } from '../../components/service-request/service-request-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { 
  ClipboardList, 
  AlertTriangle, 
  Link2
} from 'lucide-react';

interface LinkToTicketDialogProps {
  message: ClientMessage;
  isOpen: boolean;
  onClose: () => void;
  onLink: (ticketId: string) => void;
}

export function LinkToTicketDialog({
  message,
  isOpen,
  onClose,
  onLink
}: LinkToTicketDialogProps) {
  const { serviceRequests, fetchServiceRequests, linkMessageToServiceRequest } = useServiceRequest();
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  const filteredTickets = serviceRequests.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedTicketId) {
      setError('Please select a service request');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await linkMessageToServiceRequest(message.id, selectedTicketId);
      
      if (success) {
        onLink(selectedTicketId);
      } else {
        setError('Failed to link message to service request. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while linking to a ticket');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Link Message to Existing Service Request
          </DialogTitle>
          <DialogDescription>
            Associate this client message with an existing service request ticket.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="ticket-search">Search Service Requests</Label>
            <Input
              id="ticket-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or title..."
            />
          </div>
          
          <RadioGroup value={selectedTicketId} onValueChange={setSelectedTicketId}>
            <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
              {filteredTickets.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No matching service requests found
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value={ticket.id} id={ticket.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={ticket.id} className="font-medium cursor-pointer">
                          {ticket.title}
                        </Label>
                        <div className="text-sm text-gray-500">
                          ID: {ticket.id} | Status: {ticket.status} | Priority: {ticket.priority}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </RadioGroup>
          
          {error && (
            <div className="bg-red-100 p-3 rounded text-red-800 text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedTicketId}
          >
            {isSubmitting ? 'Linking...' : 'Link to Service Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}