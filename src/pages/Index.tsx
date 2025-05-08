
import React, { useState } from 'react';
import EncryptionForm from '@/components/EncryptionForm';
import Dashboard from '@/components/Dashboard';
import { Shield, LockKeyhole } from 'lucide-react';
import TourButton from '@/components/TourButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('encrypt');
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <header className="py-8 px-4 bg-gradient-to-r from-blue-900/60 to-cyan-900/60">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 rounded-lg p-2">
                <LockKeyhole className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                SecureCrypt
              </h1>
            </div>
            <p className="text-gray-300 max-w-2xl">
              AES-powered encryption with intelligent content analysis. 
              Secure your sensitive files and text with military-grade encryption.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TourButton />
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Features Banner */}
      <div className="bg-blue-950/30 py-4 border-y border-blue-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex flex-wrap justify-center md:justify-between gap-x-8 gap-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              AES-256 Encryption
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              AI Content Analysis
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              Password-Based Key Derivation
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              File & Text Support
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="encrypt" className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Encrypt & Decrypt</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
              <LockKeyhole className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="encrypt" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">Encrypt or Decrypt</h2>
              <p className="text-gray-400">
                Enter text or upload a file, add your password, and choose to encrypt or decrypt your data. 
                Our AI will analyze content for sensitive information and recommend appropriate security measures.
              </p>
            </div>
            
            {/* Encryption Form Component with ID for feature1 */}
            <div id="feature1" className="relative">
              <EncryptionForm />
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>
        </Tabs>
        
        {/* Add specific IDs for the other features */}
        <div id="feature2" className="hidden md:block"></div> {/* File upload is inside EncryptionForm */}
        <div id="feature3" className="hidden md:block"></div> {/* AI Analysis is inside EncryptionForm */}
        
        {/* Implementation Notes */}
        <div className="mt-12 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg">
          <h3 className="font-medium text-blue-400 mb-2">Security Information</h3>
          <p className="text-sm text-gray-400 mb-2">
            SecureCrypt uses real AES-256 encryption with the following security features:
          </p>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
            <li>AES-256 encryption with CBC mode and PKCS#7 padding</li>
            <li>PBKDF2 key derivation with configurable iterations (min 100,000)</li>
            <li>Unique salt and initialization vector (IV) for each encryption</li>
            <li>Zero-knowledge, client-side encryption - your data never leaves your device</li>
            <li>AI-powered content analysis to detect sensitive information</li>
          </ul>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-500">
          <p>SecureCrypt — Secure file & text encryption with intelligent content analysis.</p>
          <p className="mt-2">Using industry-standard AES-256 encryption with zero-knowledge principles.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
