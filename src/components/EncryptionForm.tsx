
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Lock, Unlock, Shield, FileText, 
  AlertCircle, Eye, EyeOff, Wand2
} from 'lucide-react';
import FileUpload from './FileUpload';
import AiSuggestion from './AiSuggestion';
import OutputSection from './OutputSection';
import { 
  encrypt, 
  decrypt, 
  EncryptedData,
  fileToBase64
} from '@/utils/encryptionUtils';
import { analyzeContent, analyzeFilename, AiAnalysisResult } from '@/utils/aiAnalyzer';

const EncryptionForm = () => {
  const { toast } = useToast();
  
  // Form states
  const [inputTab, setInputTab] = useState<string>('text');
  const [inputText, setInputText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(10000);
  const [keyLength, setKeyLength] = useState<number>(256);
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [outputResult, setOutputResult] = useState<{
    content: string | null,
    isEncrypted: boolean,
    filename?: string
  } | null>(null);
  
  // AI suggestion state
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  
  // Handle file selection
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    
    // Run AI analysis on filename
    const analysis = analyzeFilename(selectedFile.name);
    setAiAnalysis(analysis);
    
    toast({
      title: "File selected",
      description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
    });
  };
  
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    // Run AI analysis if text is not too short
    if (text.length > 10) {
      const analysis = analyzeContent(text);
      setAiAnalysis(analysis);
    } else if (text.length === 0) {
      setAiAnalysis(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter a password for encryption/decryption.",
      });
      return;
    }
    
    if (inputTab === 'text' && !inputText) {
      toast({
        variant: "destructive",
        title: "Text required",
        description: "Please enter some text to encrypt or decrypt.",
      });
      return;
    }
    
    if (inputTab === 'file' && !file) {
      toast({
        variant: "destructive",
        title: "File required",
        description: "Please select a file to encrypt or decrypt.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (mode === 'encrypt') {
        // Handle encryption
        await handleEncryption();
      } else {
        // Handle decryption
        await handleDecryption();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Operation failed",
        description: (error as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle encryption
  const handleEncryption = async () => {
    const options = { iterations, keyLength };
    
    if (inputTab === 'text') {
      // Encrypt text
      const result = encrypt(inputText, password, options);
      setOutputResult({
        content: JSON.stringify(result),
        isEncrypted: true
      });
      
      toast({
        title: "Encryption successful",
        description: "Your text has been encrypted."
      });
    } else if (file) {
      // Encrypt file
      try {
        // Convert file to base64
        const base64Content = await fileToBase64(file);
        
        // Encrypt the base64 content
        const result = encrypt(base64Content, password, options);
        
        // Include file metadata
        const fileData = {
          ...result,
          filename: file.name,
          type: file.type,
          size: file.size
        };
        
        setOutputResult({
          content: JSON.stringify(fileData),
          isEncrypted: true,
          filename: `${file.name}.encrypted`
        });
        
        toast({
          title: "Encryption successful",
          description: `${file.name} has been encrypted.`
        });
      } catch (error) {
        throw new Error(`Failed to encrypt file: ${(error as Error).message}`);
      }
    }
  };
  
  // Handle decryption
  const handleDecryption = async () => {
    const options = { iterations, keyLength };
    
    if (inputTab === 'text') {
      try {
        // Parse the encrypted data
        const encryptedData = JSON.parse(inputText) as EncryptedData;
        
        // Decrypt the content
        const decryptedContent = decrypt(encryptedData, password, options);
        
        setOutputResult({
          content: decryptedContent,
          isEncrypted: false
        });
        
        // Run AI analysis on the decrypted content
        const analysis = analyzeContent(decryptedContent);
        setAiAnalysis(analysis);
        
        toast({
          title: "Decryption successful",
          description: "Your text has been decrypted."
        });
      } catch (error) {
        if ((error as Error).message.includes("Incorrect password")) {
          throw new Error("Incorrect password. Please check and try again.");
        } else {
          throw new Error("Invalid encrypted data format. Please check your input.");
        }
      }
    } else if (file) {
      // File decryption is not fully implemented in this demo
      // In a real app, we would read the file, parse its JSON content,
      // decrypt it, and offer the original file for download
      toast({
        variant: "destructive",
        title: "Feature not implemented",
        description: "File decryption is not fully implemented in this demo. Please use text mode."
      });
    }
  };
  
  // Handle AI suggestion
  const handleGetAiSuggestion = () => {
    if (inputTab === 'text' && inputText) {
      const analysis = analyzeContent(inputText);
      setAiAnalysis(analysis);
      
      toast({
        title: "AI Analysis Complete",
        description: analysis.shouldEncrypt 
          ? "Encryption is recommended for this content." 
          : "No sensitive data detected."
      });
    } else if (inputTab === 'file' && file) {
      const analysis = analyzeFilename(file.name);
      setAiAnalysis(analysis);
      
      toast({
        title: "AI Analysis Complete",
        description: analysis.shouldEncrypt 
          ? "Encryption is recommended for this file." 
          : "No sensitive data detected in filename."
      });
    } else {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter text or select a file first."
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Section */}
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
        
        {/* Password Input */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        {/* Advanced Options */}
        <div className="flex items-center space-x-2">
          <Switch
            id="advanced-mode"
            checked={isAdvanced}
            onCheckedChange={setIsAdvanced}
          />
          <Label htmlFor="advanced-mode">Advanced options</Label>
        </div>
        
        {isAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iterations">PBKDF2 Iterations</Label>
              <Input
                id="iterations"
                type="number"
                min="1000"
                max="100000"
                step="1000"
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
              />
              <p className="text-xs text-gray-400">
                Higher values increase security but slow down encryption/decryption
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-length">Key Length (bits)</Label>
              <select
                id="key-length"
                value={keyLength}
                onChange={(e) => setKeyLength(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value={128}>128 bits</option>
                <option value={192}>192 bits</option>
                <option value={256}>256 bits</option>
              </select>
            </div>
          </div>
        )}
        
        {/* AI Suggestion */}
        <div id="feature3">
          <AiSuggestion analysis={aiAnalysis} />
        </div>
        
        {/* Action Buttons */}
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
      </form>
      
      {/* Output Section */}
      {outputResult && (
        <OutputSection result={outputResult} className="mt-6" />
      )}
    </div>
  );
};

export default EncryptionForm;
