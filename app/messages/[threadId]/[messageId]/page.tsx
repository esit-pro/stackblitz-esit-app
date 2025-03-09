"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useMessageThreads } from '@/hooks/use-message-threads';
import { useServiceRequest, ServiceRequestProvider } from '@/components/service-request/service-request-context';
import { MessageThread, ThreadMessage } from '@/models/types';
import { MessageThread as MessageThreadComponent } from '@/components/messages/message-thread';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ClipboardList,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

function ThreadPageContent({
  params,
}: {
  params: { threadId: string };
}) {
  const router = useRouter();
  const { 
    threads, 
    loading, 
    getThreadById, 
    addMessageToThread, 
    archiveThread, 
    refreshThreads 
  } = useMessageThreads();
  
  const { serviceRequests, fetchServiceRequestById, currentServiceRequest } = useServiceRequest();
  const [thread, setThread] = useState<MessageThread | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch the thread
  useEffect(() => {
    const fetchThread = async () => {
      const result = await getThreadById(params.threadId);
      if (result) {
        setThread(result);
        
        // If thread has a service request, fetch it too
        if (result.serviceRequestId) {
          fetchServiceRequestById(result.serviceRequestId);
        }
      } else {
        setError('Thread not found');
      }
    };
    
    fetchThread();
  }, [params.threadId, getThreadById, fetchServiceRequestById]);

  // Handle reply submission
  const handleReply = async (threadId: string, content: string) => {
    setSubmitting(true);
    try {
      await addMessageToThread(threadId, {
        content,
        sender: 'provider',
        senderName: 'Support Agent',
        timestamp: new Date().toISOString(),
        isRead: true
      });
      // Refresh the thread data
      const updatedThread = await getThreadById(threadId);
      if (updatedThread) {
        setThread(updatedThread);
      }
    } catch (err) {
      setError('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle thread archiving
  const handleArchive = async (threadId: string) => {
    try {
      if (!thread) return;
      const newArchiveState = !thread.isArchived;
      
      await archiveThread(threadId, newArchiveState);
      
      // Update local state
      setThread({
        ...thread,
        isArchived: newArchiveState
      });
    } catch (err) {
      setError('Failed to archive thread');
    }
  };

  // Go back to message list
  const handleBack = () => {
    router.push('/messages');
  };

  // View the related service request
  const handleViewServiceRequest = () => {
    if (thread?.serviceRequestId) {
      router.push(`/service-requests/${thread.serviceRequestId}`);
    }
  };

  if (loading) {
    return <div className="container max-w-7xl mx-auto py-6 px-4">Loading conversation...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
      </div>
    );
  }

  if (!thread) {
    return <div className="container max-w-7xl mx-auto py-6 px-4">Thread not found</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4" data-testid="thread-page">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        
        {thread.serviceRequestId && (
          <Button variant="outline" onClick={handleViewServiceRequest}>
            <ClipboardList className="h-4 w-4 mr-2" />
            View Service Request
          </Button>
        )}
      </div>
      
      {currentServiceRequest && (
        <Alert className="mb-4">
          <ClipboardList className="h-4 w-4" />
          <AlertTitle>Related Service Request</AlertTitle>
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span>
                #{currentServiceRequest.id.replace('ticket-', '')}: {currentServiceRequest.title}
              </span>
              <Badge variant={
                currentServiceRequest.status === 'Resolved' 
                  ? 'secondary' 
                  : currentServiceRequest.status === 'In Progress'
                  ? 'default'
                  : 'outline'
              }>
                {currentServiceRequest.status}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <MessageThreadComponent 
        thread={thread} 
        onReply={handleReply} 
        onArchive={handleArchive}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default function ThreadPage(props: { params: { threadId: string } }) {
  return (
    <Suspense fallback={<div className="container max-w-7xl mx-auto py-6 px-4">Loading conversation...</div>}>
      <ServiceRequestProvider>
        <ThreadPageContent {...props} />
      </ServiceRequestProvider>
    </Suspense>
  );
}