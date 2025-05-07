
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdvancedOptionsProps {
  iterations: number;
  setIterations: (iterations: number) => void;
  keyLength: number;
  setKeyLength: (keyLength: number) => void;
  setShowInfoModal: (show: boolean) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  iterations,
  setIterations,
  keyLength,
  setKeyLength,
  setShowInfoModal
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  // Handle iterations input change with validation
  const handleIterationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Enforce minimum value on UI
    setIterations(isNaN(value) ? 150000 : Math.max(100000, value));
  };

  return (
    <div className="space-y-3 border border-blue-900/30 rounded-lg p-4 bg-blue-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="advanced-mode"
            checked={isAdvancedOpen}
            onCheckedChange={setIsAdvancedOpen}
          />
          <Label htmlFor="advanced-mode" className="font-medium">Advanced Encryption Options</Label>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          type="button"
          onClick={() => setShowInfoModal(true)}
        >
          <Info size={16} className="text-blue-400" />
        </Button>
      </div>
      
      <Collapsible open={isAdvancedOpen} className="space-y-4">
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="iterations" className="text-sm">PBKDF2 Iterations</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-blue-400/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-xs">
                    The number of times your password is processed to generate a secure key. 
                    Higher values make it harder for attackers to guess your password, but may slow down encryption/decryption.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="iterations"
                type="number"
                min="100000"
                step="10000"
                value={iterations}
                onChange={handleIterationsChange}
              />
              <p className="text-xs text-gray-400">
                Minimum: 100,000 (higher values increase security)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="key-length" className="text-sm">Key Length (bits)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-blue-400/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-xs">
                    The size of the encryption key. 256-bit is standard for strong AES encryption.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={keyLength.toString()} onValueChange={(value) => setKeyLength(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select key length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128 bits</SelectItem>
                  <SelectItem value="192">192 bits</SelectItem>
                  <SelectItem value="256">256 bits</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                256-bit provides the strongest encryption
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AdvancedOptions;
