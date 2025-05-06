
import React from 'react';
import EncryptionForm from '@/components/EncryptionForm';
import { Shield, LockKeyhole } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <header className="py-8 px-4 bg-gradient-to-r from-blue-900/60 to-cyan-900/60">
        <div className="max-w-5xl mx-auto">
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
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Encrypt or Decrypt</h2>
          <p className="text-gray-400">
            Enter text or upload a file, add your password, and choose to encrypt or decrypt your data. 
            Our AI will analyze content for sensitive information and recommend appropriate security measures.
          </p>
        </div>
        
        {/* Encryption Form Component */}
        <EncryptionForm />
        
        {/* Implementation Notes */}
        <div className="mt-12 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg">
          <h3 className="font-medium text-blue-400 mb-2">Developer Notes</h3>
          <p className="text-sm text-gray-400 mb-2">
            This is a simulation of an encryption application. In a production application:
          </p>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
            <li>Real cryptographic libraries would be used instead of the simulation</li>
            <li>The Python backend would handle actual encryption/decryption using libraries like cryptography or pycryptodome</li>
            <li>A more sophisticated AI model could be implemented for content analysis</li>
            <li>Secure key management practices would be implemented</li>
          </ul>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-500">
          <p>SecureCrypt — Secure file & text encryption with intelligent content analysis.</p>
          <p className="mt-2">This is a demo application for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
