
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { evaluatePasswordStrength } from '@/utils/encryptionUtils';
import { analyzeContent, analyzeFilename } from '@/utils/aiAnalyzer';
import { encrypt, decrypt, EncryptedData, fileToBase64 } from '@/utils/encryptionUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Import refactored components
import InputSection from './encryption/InputSection';
import PasswordInput from './encryption/PasswordInput';
import AdvancedOptions from './encryption/AdvancedOptions';
import ActionButtons from './encryption/ActionButtons';
import ZeroKnowledgeBadge from './encryption/ZeroKnowledgeBadge';
import AiSuggestion from './AiSuggestion';
import OutputSection from './OutputSection';
import EncryptionInfoModal from './EncryptionInfoModal';

const EncryptionForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Form states
  const [inputTab, setInputTab] = useState<string>('text');
  const [inputText, setInputText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  
  // Advanced options state
  const [iterations, setIterations] = useState<number>(150000);
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
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  
  // Calculate password strength
  const passwordStrength = evaluatePasswordStrength(password);
  
  // Track encryption/decryption in Supabase
  const trackOperation = async (operation: {
    contentType: string;
    fileName?: string;
    isEncrypted: boolean;
    metadata?: any;
  }) => {
    if (!user) return;
    
    try {
      await supabase.from('encryption_history').insert({
        user_id: user.id,
        content_type: operation.contentType,
        file_name: operation.fileName,
        is_encrypted: operation.isEncrypted,
        metadata: operation.metadata
      });
    } catch (error) {
      console.error('Failed to track encryption operation:', error);
    }
  };
  
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

    // Server-side-like validation - enforce minimum iterations
    const safeIterations = Math.max(100000, iterations);
    if (safeIterations !== iterations) {
      toast({
        title: "Security notice",
        description: "Iteration count adjusted to meet minimum security requirements.",
      });
      setIterations(safeIterations);
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
      
      // Track the encryption operation
      await trackOperation({
        contentType: 'text',
        isEncrypted: true,
        metadata: { 
          size: inputText.length,
          strength: passwordStrength.score,
          aiRecommended: aiAnalysis?.shouldEncrypt || false
        }
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
        
        // Track the encryption operation
        await trackOperation({
          contentType: 'file',
          fileName: file.name,
          isEncrypted: true,
          metadata: {
            fileType: file.type,
            size: file.size,
            strength: passwordStrength.score,
            aiRecommended: aiAnalysis?.shouldEncrypt || false
          }
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
        
        // Track the decryption operation
        await trackOperation({
          contentType: 'text',
          isEncrypted: false,
          metadata: { 
            size: decryptedContent.length,
            strength: passwordStrength.score
          }
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
      {/* Zero-Knowledge Encryption Badge */}
      <ZeroKnowledgeBadge />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Section */}
        <InputSection 
          inputTab={inputTab}
          setInputTab={setInputTab}
          inputText={inputText}
          setInputText={setInputText}
          handleTextChange={handleTextChange}
          file={file}
          handleFileSelect={handleFileSelect}
        />
        
        {/* Password Input with Strength Meter */}
        <PasswordInput 
          password={password}
          setPassword={setPassword}
          passwordStrength={passwordStrength}
        />
        
        {/* Advanced Options */}
        <AdvancedOptions 
          iterations={iterations}
          setIterations={setIterations}
          keyLength={keyLength}
          setKeyLength={setKeyLength}
          setShowInfoModal={setShowInfoModal}
        />
        
        {/* AI Suggestion */}
        <div id="feature3">
          <AiSuggestion analysis={aiAnalysis} />
        </div>
        
        {/* Action Buttons */}
        <ActionButtons 
          isProcessing={isProcessing}
          mode={mode}
          setMode={setMode}
          handleGetAiSuggestion={handleGetAiSuggestion}
        />
      </form>
      
      {/* Output Section */}
      {outputResult && (
        <OutputSection result={outputResult} className="mt-6" />
      )}
      
      {/* Info Modal */}
      <EncryptionInfoModal open={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default EncryptionForm;
