
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiAnalysisResult } from '@/utils/aiAnalyzer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface AiSuggestionProps {
  analysis: AiAnalysisResult | null;
  className?: string;
}

const AiSuggestion: React.FC<AiSuggestionProps> = ({ analysis, className }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!analysis) {
    return (
      <div className={cn("p-4 rounded-lg bg-secondary/50", className)}>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-400" />
          <p className="text-sm text-gray-300">Add content for AI analysis</p>
        </div>
      </div>
    );
  }
  
  // Determine the appropriate icon and style based on confidence score
  let Icon = Info;
  let colorClass = "text-blue-400";
  let bgClass = "bg-blue-900/20";
  
  if (analysis.shouldEncrypt) {
    if (analysis.riskLevel === 'high') {
      Icon = AlertTriangle;
      colorClass = "text-red-400";
      bgClass = "bg-red-900/20";
    } else if (analysis.riskLevel === 'medium') {
      Icon = Shield;
      colorClass = "text-amber-400"; 
      bgClass = "bg-amber-900/20";
    } else {
      Icon = Info;
      colorClass = "text-blue-400";
      bgClass = "bg-blue-900/20";
    }
  } else {
    Icon = CheckCircle;
    colorClass = "text-green-400";
    bgClass = "bg-green-900/20";
  }
  
  return (
    <div className={cn(`p-4 rounded-lg ${bgClass} border border-${colorClass}/30`, className)}>
      <div className="flex gap-3">
        <div className={`mt-1 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${colorClass}`}>
              {analysis.shouldEncrypt 
                ? "Encryption Recommended" 
                : "No Sensitive Data Detected"}
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className={colorClass}>
                    {analysis.shouldEncrypt 
                      ? `Sensitive Content Detected (${analysis.confidenceScore}% confidence)` 
                      : "Content Analysis Results"}
                  </DialogTitle>
                  <DialogDescription>
                    {analysis.detailedExplanation}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-sm text-gray-300">
                  <p className="mb-2 font-medium">Why we made this recommendation:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.detectedKeywords.length > 0 ? (
                      <>
                        <li>Detected {analysis.detectedKeywords.length} sensitive keywords</li>
                        <li>Primary category: {analysis.category}</li>
                        <li>Risk level: {analysis.riskLevel}</li>
                      </>
                    ) : (
                      <li>No sensitive keywords were detected in this content</li>
                    )}
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-gray-300">{analysis.reason}</p>
          
          {analysis.detectedKeywords.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">Detected sensitive keywords:</p>
              <div className="flex flex-wrap gap-1">
                {analysis.detectedKeywords.slice(0, 5).map((keyword, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${colorClass}/20 border border-${colorClass}/30`}
                  >
                    {keyword}
                  </span>
                ))}
                {analysis.detectedKeywords.length > 5 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                    +{analysis.detectedKeywords.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {analysis.confidenceScore > 0 && (
            <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${colorClass}`} 
                style={{ width: `${analysis.confidenceScore}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSuggestion;
