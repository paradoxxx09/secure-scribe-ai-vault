
import React from 'react';
import { FileText, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '../FileUpload';

interface InputSectionProps {
  inputTab: string;
  setInputTab: (tab: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  file: File | null;
  handleFileSelect: (file: File) => Promise<void>;
}

const InputSection: React.FC<InputSectionProps> = ({
  inputTab,
  setInputTab,
  inputText,
  handleTextChange,
  file,
  handleFileSelect
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue={inputTab} onValueChange={setInputTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2" id="feature2">
            <Lock className="h-4 w-4" />
            <span>File</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 p-1">
          <Textarea 
            placeholder="Enter text to encrypt or paste encrypted content to decrypt..."
            value={inputText}
            onChange={handleTextChange}
            className="min-h-[200px] font-mono text-sm"
          />
        </TabsContent>
        
        <TabsContent value="file" className="space-y-4 p-1">
          <FileUpload onFileSelect={handleFileSelect} />
          {file && (
            <div className="p-3 bg-secondary/30 rounded-md">
              <p className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InputSection;
