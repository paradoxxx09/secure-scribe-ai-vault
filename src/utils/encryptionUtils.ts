
// Real implementation of encryption/decryption functionality using crypto-js
import CryptoJS from 'crypto-js';

// Interface for encrypted data structure
export interface EncryptedData {
  encryptedContent: string;
  iv: string; // initialization vector
  salt: string;
}

// Interface for encryption options
export interface EncryptionOptions {
  iterations?: number; // PBKDF2 iterations
  keyLength?: number; // Key length in bits
}

// Global encryption stats for dashboard
export const encryptionStats = {
  filesEncrypted: 0,
  textEncrypted: 0,
  sensitiveContentDetected: 0,
  totalOperations: 0,
  categoryCount: {
    financial: 0,
    identity: 0,
    personal: 0,
    professional: 0
  }
};

// Real implementation of encryption process
export const encrypt = (
  content: string | ArrayBuffer,
  password: string,
  options: EncryptionOptions = {}
): EncryptedData => {
  // Get options with defaults
  const iterations = options.iterations || 150000;
  const keySize = (options.keyLength || 256) / 32; // Convert bits to words (32 bits per word)

  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  
  // Generate a random IV (initialization vector)
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  
  // Convert content to string if it's ArrayBuffer
  let contentStr = '';
  if (content instanceof ArrayBuffer) {
    const decoder = new TextDecoder();
    contentStr = decoder.decode(content);
  } else {
    contentStr = content;
  }
  
  // Derive key using PBKDF2 (Password-Based Key Derivation Function 2)
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: keySize,
    iterations: iterations
  });
  
  // Encrypt the content using AES
  const encrypted = CryptoJS.AES.encrypt(contentStr, key.toString(), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Update stats
  encryptionStats.totalOperations++;
  if (content instanceof ArrayBuffer) {
    encryptionStats.filesEncrypted++;
  } else {
    encryptionStats.textEncrypted++;
  }
  
  // Return encrypted data with salt and IV
  return {
    encryptedContent: encrypted.toString(),
    iv: iv,
    salt: salt
  };
};

// Real implementation of decryption process
export const decrypt = (
  encryptedData: EncryptedData,
  password: string,
  options: EncryptionOptions = {}
): string => {
  try {
    // Get options with defaults
    const iterations = options.iterations || 150000;
    const keySize = (options.keyLength || 256) / 32; // Convert bits to words
    
    // Derive the same key using PBKDF2 with the provided salt
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(encryptedData.salt), {
      keySize: keySize,
      iterations: iterations
    });
    
    // Decrypt the content
    const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedContent, key.toString(), {
      iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert to UTF8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    // If decryption produced an empty string, the password was likely incorrect
    if (!decryptedText) {
      throw new Error("Incorrect password");
    }
    
    // Update stats
    encryptionStats.totalOperations++;
    
    return decryptedText;
  } catch (error) {
    if (error instanceof Error && error.message === "Incorrect password") {
      throw new Error("Incorrect password");
    } else {
      throw new Error("Failed to decrypt: Invalid data format or incorrect password");
    }
  }
};

// Function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result) {
        // Convert ArrayBuffer to Base64 string
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        resolve(base64);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  });
};

// Function to convert base64 to blob for file download
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, { type: mimeType });
  return blob;
};

// Create a download URL for a file
export const createDownloadUrl = (content: string, filename: string, mimeType: string = 'text/plain'): string => {
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
};

// Password strength evaluation
export interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 4: very strong)
  feedback: string;
  color: string;
}

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, feedback: "Enter a password", color: "bg-gray-300" };
  }
  
  let score = 0;
  let feedback = "";
  let color = "";
  
  // Length check
  if (password.length < 8) {
    feedback = "Password is too short";
    color = "bg-red-500";
    return { score, feedback, color };
  } else if (password.length >= 16) {
    score += 2;
  } else if (password.length >= 12) {
    score += 1;
  }
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Combination complexity
  if (/[A-Z].*[0-9]|[0-9].*[A-Z]/.test(password)) score += 0.5;
  if (/[a-z].*[0-9]|[0-9].*[a-z]/.test(password)) score += 0.5;
  if (/[A-Z].*[^A-Za-z0-9]|[^A-Za-z0-9].*[A-Z]/.test(password)) score += 0.5;
  if (/[a-z].*[^A-Za-z0-9]|[^A-Za-z0-9].*[a-z]/.test(password)) score += 0.5;

  // Determine feedback and color based on score
  if (score >= 4) {
    feedback = "Very strong password";
    color = "bg-green-500";
  } else if (score >= 3) {
    feedback = "Strong password";
    color = "bg-green-400";
  } else if (score >= 2) {
    feedback = "Medium strength password";
    color = "bg-yellow-500";
  } else {
    feedback = "Weak password";
    color = "bg-red-400";
  }
  
  return {
    score: Math.min(4, Math.floor(score)),
    feedback,
    color
  };
};
