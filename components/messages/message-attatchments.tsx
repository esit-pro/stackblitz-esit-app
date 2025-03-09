import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface MessageAttachmentsProps {
  attachments: string[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium mb-4">Attachments</h3>
      {attachments.map((attachment, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 border rounded-md"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="font-medium">{attachment}</span>
          </div>
          <div className="space-x-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}