"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  timestamp: string;
}

export default function MessageDetailPage() {
  const params = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/messages/${params.threadId}`);
        if (!response.ok) throw new Error('Failed to fetch message');
        const data = await response.json();
        setMessage(data);
      } catch (error) {
        console.error('Error fetching message:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [params.threadId]);

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-6 px-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-xl font-semibold text-destructive">Message not found</h1>
        <Link href="/messages" className="text-primary hover:underline mt-4 inline-block">
          Return to messages
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/messages"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{message.subject}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <span className="font-medium mr-2">{message.sender}</span>
          <span className="text-sm">
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {message.content}
        </div>
      </div>
    </div>
  );
}
