
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiAnalysisResult } from '@/utils/aiAnalyzer';

interface AiSuggestionProps {
  analysis: AiAnalysisResult | null;
  className?: string;
}

const AiSuggestion: React.FC<AiSuggestionProps> = ({ analysis, className }) => {
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
    if (analysis.confidenceScore > 80) {
      Icon = AlertTriangle;
      colorClass = "text-red-400";
      bgClass = "bg-red-900/20";
    } else if (analysis.confidenceScore > 50) {
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
        <div>
          <h3 className={`font-medium mb-1 ${colorClass}`}>
            {analysis.shouldEncrypt 
              ? "Encryption Recommended" 
              : "No Sensitive Data Detected"}
          </h3>
          <p className="text-sm text-gray-300">{analysis.reason}</p>
          
          {analysis.detectedKeywords.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">Detected sensitive keywords:</p>
              <div className="flex flex-wrap gap-1">
                {analysis.detectedKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${colorClass}/20 border border-${colorClass}/30`}
                  >
                    {keyword}
                  </span>
                ))}
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
