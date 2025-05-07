
import React from 'react';
import { Lock, Unlock, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isProcessing: boolean;
  mode: 'encrypt' | 'decrypt';
  setMode: (mode: 'encrypt' | 'decrypt') => void;
  handleGetAiSuggestion: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isProcessing,
  mode,
  setMode,
  handleGetAiSuggestion
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        type="button"
        variant="outline"
        className="suggestion-gradient text-white"
        onClick={handleGetAiSuggestion}
        disabled={isProcessing}
      >
        <Wand2 className="h-4 w-4 mr-2" />
        AI Suggestion
      </Button>
      
      <Button
        type="submit"
        className="encrypt-gradient text-white"
        onClick={() => setMode('encrypt')}
        disabled={isProcessing}
      >
        {isProcessing && mode === 'encrypt' ? (
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Lock className="h-4 w-4 mr-2" />
        )}
        Encrypt
      </Button>
      
      <Button
        type="submit"
        className="decrypt-gradient text-white"
        onClick={() => setMode('decrypt')}
        disabled={isProcessing}
      >
        {isProcessing && mode === 'decrypt' ? (
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Unlock className="h-4 w-4 mr-2" />
        )}
        Decrypt
      </Button>
    </div>
  );
};

export default ActionButtons;
