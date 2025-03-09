import { ItemDetail } from '@/components/items/item-detail';
import { useServiceRequests } from '@/hooks/use-service-requests';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';

// Make this a client component to use hooks
('use client');

export default function ServiceRequestDetailPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { requests, updateStatus, updatePriority } = useServiceRequests();
  const request = requests.find((req) => req.id === params.requestId);

  // If service request not found, show 404
  if (!request) {
    notFound();
  }

  // Map priority number to text
  const priorityText = {
    1: 'Lowest',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Critical',
  }[request.priority];

  // Calculate priority color
  const priorityColor = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
  }[request.priority];

  // Calculate status color
  const statusColor = {
    New: 'bg-purple-100 text-purple-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Waiting on Client': 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
  }[request.status];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <a
          href="/service-requests"
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all requests
        </a>
      </div>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Request #{request.id}</h1>
            <p className="text-muted-foreground mt-2">{request.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`px-3 py-1 ${statusColor}`}>
              {request.status}
            </Badge>
            <Badge className={`px-3 py-1 ${priorityColor}`}>
              {priorityText} Priority
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span>{' '}
                  {request.clientName}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{' '}
                  {request.clientEmail}
                </div>
                <div>
                  <span className="font-medium">Client ID:</span>{' '}
                  {request.clientId}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {format(new Date(request.createdAt), 'PPP')}(
                  {formatDistanceToNow(new Date(request.createdAt), {
                    addSuffix: true,
                  })}
                  )
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {format(new Date(request.updatedAt), 'PPP')}(
                  {formatDistanceToNow(new Date(request.updatedAt), {
                    addSuffix: true,
                  })}
                  )
                </div>
                {request.dueDate && (
                  <div>
                    <span className="font-medium">Due Date:</span>{' '}
                    {format(new Date(request.dueDate), 'PPP')}(
                    {formatDistanceToNow(new Date(request.dueDate), {
                      addSuffix: true,
                    })}
                    )
                  </div>
                )}
                <div>
                  <span className="font-medium">Estimated Hours:</span>{' '}
                  {request.estimatedHours || 'Not set'}
                </div>
                <div>
                  <span className="font-medium">Actual Hours:</span>{' '}
                  {request.actualHours || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{request.description}</p>
          </CardContent>
        </Card>

        {/* Tags */}
        {request.tags && request.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {request.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{request.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Related Messages */}
        {request.sourceMessageIds && request.sourceMessageIds.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Related Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {request.sourceMessageIds.map((messageId) => (
                  <li key={messageId}>
                    <a
                      href={`/messages/${messageId}`}
                      className="text-blue-500 hover:underline"
                    >
                      Message #{messageId}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
