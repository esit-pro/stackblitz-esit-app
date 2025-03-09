'use client'

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Archive,
  Trash2,
  Flag,
  Reply,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  MoreHorizontal,
  PaperPlane,
  ArrowLeft,
  ArrowRight,
  Clock,
  Clipboard,
  Tag,
  FileText,
  Paperclip,
  Star,
  Calendar,
  PlusCircle,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow, format } from 'date-fns';
import { ClientMessage, ThreadMessage } from '@/models/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClientMessages } from '@/hooks/use-client-messages';

interface MessageDetailProps {
  message: ClientMessage | null;
  onBack?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export function MessageDetail({
  message,
  onBack,
  onNavigate,
}: MessageDetailProps) {
  const [replyText, setReplyText] = useState('');
  const [currentTab, setCurrentTab] = useState<'thread' | 'details'>('thread');
  const [isCreatingServiceRequest, setIsCreatingServiceRequest] =
    useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [servicePriority, setServicePriority] = useState<1 | 2 | 3 | 4 | 5>(3);

  const {
    getMessageThread,
    sendReply,
    createServiceRequest,
    flagMessage,
    archiveMessages,
    deleteMessages,
  } = useClientMessages();

  // Get the message thread if available
  const thread = useMemo(() => {
    if (!message) return null;
    return getMessageThread(message.id);
  }, [message, getMessageThread]);

  if (!message) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No message selected</h3>
          <p className="text-muted-foreground mt-2">
            Select a message from the list to view
          </p>
        </div>
      </div>
    );
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    sendReply(message.id, replyText);
    setReplyText('');
  };

  const handleCreateServiceRequest = () => {
    if (!serviceTitle.trim()) return;

    createServiceRequest([message.id], {
      title: serviceTitle,
      category: serviceCategory,
      priority: servicePriority,
    });

    setIsCreatingServiceRequest(false);

    // In a real app, this might navigate to the new service request
  };

  // Format dates
  const receivedDate = new Date(message.received);
  const receivedTimeAgo = formatDistanceToNow(receivedDate, {
    addSuffix: true,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Message Detail</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('prev')}
            disabled={!onNavigate}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('next')}
            disabled={!onNavigate}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Message header with client info */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        message.clientName
                      )}&background=random`}
                    />
                    <AvatarFallback>
                      {message.clientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      From: {message.clientName} &lt;{message.clientEmail}&gt;
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    {format(receivedDate, 'MMM d, yyyy h:mm a')}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setIsCreatingServiceRequest(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Service Request
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          flagMessage(message.id, !message.isFlagged)
                        }
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        {message.isFlagged ? 'Remove Flag' : 'Flag Message'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => archiveMessages([message.id])}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          deleteMessages([message.id]);
                          onBack?.();
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {message.category && (
                  <Badge variant="secondary">{message.category}</Badge>
                )}

                {message.status === 'converted' && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    Converted to Service Request
                  </Badge>
                )}

                {message.isFlagged && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-800 border-amber-200"
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as 'thread' | 'details')
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="thread">Message Thread</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="thread" className="space-y-4 pt-4">
              {/* Original message */}
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <p>{message.content}</p>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Paperclip className="h-3.5 w-3.5 mr-1" />
                        Attachments ({message.attachments.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {message.attachments.map((attachment, i) => (
                          <div
                            key={i}
                            className="text-xs flex items-center p-2 border rounded"
                          >
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="truncate">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Message thread if there are replies */}
              {thread && thread.messages.length > 1 && (
                <>
                  <div className="relative pl-6 border-l-2 border-border my-6">
                    <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                      Thread
                    </div>

                    <div className="space-y-4 pt-4">
                      {thread.messages.slice(1).map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.sender === 'provider' ? 'justify-end' : ''
                          }`}
                        >
                          <Card
                            className={`w-5/6 ${
                              msg.sender === 'provider' ? 'bg-primary/5' : ''
                            }`}
                          >
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  // Continuing from the previous code,
                                  completing the message-detail.tsx component:
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={
                                        msg.sender === 'provider'
                                          ? '/avatars/support-agent.png'
                                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                              msg.senderName
                                            )}&background=random`
                                      }
                                    />
                                    <AvatarFallback>
                                      {msg.senderName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {msg.senderName}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(msg.timestamp),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3">
                              <p className="text-sm">{msg.content}</p>

                              {msg.attachments &&
                                msg.attachments.length > 0 && (
                                  <div className="mt-2 pt-2 border-t">
                                    <h4 className="text-xs font-medium mb-1 flex items-center">
                                      <Paperclip className="h-3 w-3 mr-1" />
                                      Attachments ({msg.attachments.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {msg.attachments.map((attachment, i) => (
                                        <div
                                          key={i}
                                          className="text-xs flex items-center p-1 border rounded"
                                        >
                                          <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                                          <span className="truncate max-w-[150px]">
                                            {attachment}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Reply box */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Reply to Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your response here..."
                    className="min-h-[120px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-3.5 w-3.5 mr-1" />
                    Attach Files
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <PaperPlane className="h-4 w-4 mr-1" />
                    Send Reply
                  </Button>
                </CardFooter>
              </Card>

              {/* Service Request Creation Dialog */}
              <Dialog
                open={isCreatingServiceRequest}
                onOpenChange={setIsCreatingServiceRequest}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Service Request</DialogTitle>
                    <DialogDescription>
                      Convert this client message into a service request to
                      track your work.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-title">
                        Service Request Title
                      </Label>
                      <Input
                        id="service-title"
                        placeholder="Enter a title for this request"
                        defaultValue={message.subject}
                        value={serviceTitle}
                        onChange={(e) => setServiceTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-category">Category</Label>
                      <select
                        id="service-category"
                        className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                        <option value="Security">Security</option>
                        <option value="Data Recovery">Data Recovery</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Training">Training</option>
                        <option value="Consultation">Consultation</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-priority">Priority</Label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((p) => (
                          <div key={p} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              id={`priority-${p}`}
                              name="priority"
                              className="h-4 w-4"
                              checked={servicePriority === p}
                              onChange={() =>
                                setServicePriority(p as 1 | 2 | 3 | 4 | 5)
                              }
                            />
                            <Label
                              htmlFor={`priority-${p}`}
                              className="text-sm"
                            >
                              {p}
                              {p === 1 && ' (Lowest)'}
                              {p === 5 && ' (Highest)'}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="include-message" defaultChecked />
                        <Label htmlFor="include-message">
                          Include original message content
                        </Label>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingServiceRequest(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateServiceRequest}
                      disabled={!serviceTitle.trim()}
                    >
                      Create Service Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">
                        {message.clientName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {message.clientEmail}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Client ID</p>
                      <p className="text-sm font-medium">{message.clientId}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">
                        {message.category || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Message Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Message ID
                      </p>
                      <p className="text-sm font-medium">{message.id}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Received</p>
                      <p className="text-sm font-medium flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                        {format(receivedDate, 'PPP')}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({receivedTimeAgo})
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium capitalize">
                        {message.status.replace('-', ' ')}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Assigned To
                      </p>
                      <p className="text-sm font-medium">
                        {message.assignedTo || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {message.relatedServiceId && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Related Service Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          Service Request #{message.relatedServiceId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This message has been converted to a service request
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
