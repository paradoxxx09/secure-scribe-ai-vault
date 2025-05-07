
import React from 'react';
import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const ZeroKnowledgeBadge: React.FC = () => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 rounded-lg px-4 py-2 inline-flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span className="font-medium">✅ 100% Client-Side Encryption (Zero Knowledge)</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info size={14} className="text-emerald-400/70 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] text-xs">
            Your data never leaves your browser. All encryption and decryption happens locally on your device.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ZeroKnowledgeBadge;
