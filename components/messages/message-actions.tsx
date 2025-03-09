// components/messages/message-actions.tsx
import React, { useState } from 'react';
import { ClientMessage } from '../../lib/client-messages-db';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { 
  Reply, Forward, Archive, 
  Flag, Trash, CheckCircle2,
  ClipboardList, Link2, AlertTriangle
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface MessageActionsProps {
  message: ClientMessage;
  onReply?: () => void;
  onConvertToTicket?: () => void;
  onLinkToTicket?: () => void;
  onFlag?: (id: string, isFlagged: boolean) => Promise<boolean>;
  onArchive?: (id: string) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

export function MessageActions({ 
  message, 
  onReply,
  onConvertToTicket,
  onLinkToTicket,
  onFlag,
  onArchive,
  onDelete
}: MessageActionsProps) {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReply = () => {
    if (onReply) {
      onReply();
    } else {
      // If no callback provided, scroll to the reply tab
      const replyTab = document.querySelector('[data-value="reply"]');
      if (replyTab) {
        replyTab.scrollIntoView({ behavior: 'smooth' });
        (replyTab as HTMLElement).click();
      }
    }
  };

  const handleForward = () => {
    // Implementation would create a new message draft with the content
    toast({
      title: "Forward Message",
      description: "This feature is not implemented in the demo.",
    });
  };

  const handleFlag = async () => {
    if (!onFlag) return;
    
    setIsProcessing(true);
    try {
      const newFlagState = !message.isFlagged;
      const success = await onFlag(message.id, newFlagState);
      
      if (success) {
        toast({
          title: newFlagState ? "Message Flagged" : "Message Unflagged",
          description: newFlagState 
            ? "Message has been marked as important" 
            : "Flag has been removed from message",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update flag status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    if (!onArchive) return;
    
    setIsProcessing(true);
    try {
      const success = await onArchive(message.id);
      
      if (success) {
        toast({
          title: "Message Archived",
          description: "Message has been moved to the archive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsProcessing(true);
    try {
      const success = await onDelete(message.id);
      
      if (success) {
        toast({
          title: "Message Deleted",
          description: "Message has been moved to trash",
        });
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="border-t p-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="gap-1"
          onClick={handleReply}
          disabled={isProcessing}
        >
          <Reply className="h-4 w-4" />
          Reply
        </Button>
        
        <Button
          variant="outline"
          className="gap-1"
          onClick={handleForward}
          disabled={isProcessing}
        >
          <Forward className="h-4 w-4" />
          Forward
        </Button>
        
        <div className="flex-grow"></div>
        
        {onConvertToTicket && message.status !== 'converted' && !message.relatedServiceId && (
          <Button
            variant="outline"
            className="gap-1"
            onClick={onConvertToTicket}
            disabled={isProcessing}
          >
            <ClipboardList className="h-4 w-4" />
            Convert to Ticket
          </Button>
        )}
        
        {onLinkToTicket && message.status !== 'converted' && !message.relatedServiceId && (
          <Button
            variant="outline"
            className="gap-1"
            onClick={onLinkToTicket}
            disabled={isProcessing}
          >
            <Link2 className="h-4 w-4" />
            Link to Ticket
          </Button>
        )}
        
        <Button
          variant="outline"
          className={`gap-1 ${message.isFlagged ? 'bg-yellow-100' : ''}`}
          onClick={handleFlag}
          disabled={isProcessing || !onFlag}
        >
          <Flag
            className={`h-4 w-4 ${
              message.isFlagged ? 'fill-yellow-500 text-yellow-500' : ''
            }`}
          />
          {message.isFlagged ? 'Unflag' : 'Flag'}
        </Button>
        
        <Button
          variant="outline"
          className="gap-1"
          onClick={handleArchive}
          disabled={isProcessing || !onArchive || message.status === 'archived'}
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>
        
        <Button
          variant="outline"
          className="gap-1 text-red-600 hover:bg-red-50"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isProcessing || !onDelete || message.status === 'deleted'}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Message
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action will move the message to trash.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}