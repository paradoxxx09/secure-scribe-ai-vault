
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Download, Copy, Lock, Unlock } from 'lucide-react';
import { createDownloadUrl } from '@/utils/encryptionUtils';

interface OutputSectionProps {
  result: {
    content: string | null;
    isEncrypted: boolean;
    filename?: string;
  };
  className?: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({ result, className }) => {
  // Handle copy to clipboard
  const handleCopy = () => {
    if (result.content) {
      navigator.clipboard.writeText(result.content);
    }
  };
  
  // Handle file download
  const handleDownload = () => {
    if (!result.content) return;
    
    const filename = result.filename || (result.isEncrypted ? 'encrypted-data.json' : 'decrypted-data.txt');
    const mimeType = result.isEncrypted ? 'application/json' : 'text/plain';
    
    // Create download URL
    const url = createDownloadUrl(result.content, filename, mimeType);
    
    // Create and trigger download link
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format content for display (limit size for large content)
  const formatContentForDisplay = (content: string | null): string => {
    if (!content) return '';
    
    // For encrypted JSON content, try to format it
    if (result.isEncrypted) {
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return content;
      }
    }
    
    return content;
  };
  
  const displayContent = formatContentForDisplay(result.content);
  
  // Determine if content is too large to display in full
  const isTruncated = displayContent.length > 2000;
  const truncatedContent = isTruncated 
    ? displayContent.substring(0, 2000) + '...\n[Content truncated for display]' 
    : displayContent;
  
  return (
    <Card className={cn("border border-gray-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {result.isEncrypted ? 'Encrypted Output' : 'Decrypted Output'}
        </CardTitle>
        <Badge variant={result.isEncrypted ? "default" : "outline"} className={cn(
          "flex items-center",
          !result.isEncrypted && "bg-success/20 text-success hover:bg-success/30"
        )}>
          {result.isEncrypted ? (
            <>
              <Lock className="h-3 w-3 mr-1" />
              <span>Encrypted</span>
            </>
          ) : (
            <>
              <Unlock className="h-3 w-3 mr-1" />
              <span>Decrypted</span>
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="overflow-auto bg-black/50 rounded-md p-4 text-xs font-mono text-gray-300 max-h-80">
            {truncatedContent}
          </pre>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-white flex-1"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
          
          <Button
            onClick={handleDownload}
            className="bg-blue-700 hover:bg-blue-600 text-white flex-1"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download {result.isEncrypted ? 'Encrypted Data' : 'Decrypted Data'}
          </Button>
        </div>
        
        {isTruncated && (
          <p className="text-xs text-gray-400 italic">
            Note: Output content is large and has been truncated for display.
            Use the download button to get the complete content.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputSection;
