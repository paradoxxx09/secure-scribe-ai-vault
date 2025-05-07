
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Key } from 'lucide-react';

interface EncryptionInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const EncryptionInfoModal = ({ open, onClose }: EncryptionInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-400">
            <Shield className="h-5 w-5" />
            Advanced Encryption Settings Explained
          </DialogTitle>
          <DialogDescription>
            Understanding how these settings affect security and performance
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-400" />
              PBKDF2 Iterations
            </h3>
            <p className="text-sm text-gray-400">
              PBKDF2 (Password-Based Key Derivation Function) strengthens your password by repeatedly 
              processing it to create a secure encryption key.
            </p>
            <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
              <li>Higher values (200,000+) provide stronger security against brute force attacks</li>
              <li>Lower values (100,000-150,000) will process faster but offer less protection</li>
              <li>For most sensitive data, we recommend at least 150,000 iterations</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-400" />
              Key Length
            </h3>
            <p className="text-sm text-gray-400">
              The encryption key length determines the strength of the AES encryption algorithm.
            </p>
            <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
              <li><strong>256-bit keys</strong> (recommended): Maximum security, military-grade protection</li>
              <li><strong>192-bit keys</strong>: Strong security with slightly better performance</li>
              <li><strong>128-bit keys</strong>: Still secure for most purposes, fastest performance</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              For most users, the default settings (150,000 iterations and 256-bit keys) provide 
              excellent security. Only adjust these settings if you have specific requirements.
            </p>
          </div>
        </div>
        
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default EncryptionInfoModal;
