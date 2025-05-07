
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PasswordStrength } from '@/utils/encryptionUtils';

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  passwordStrength: PasswordStrength;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  password, 
  setPassword,
  passwordStrength 
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="space-y-2">
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
      
      {/* Password strength meter */}
      {password && (
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 ${i < passwordStrength.score ? passwordStrength.color : 'bg-transparent'} inline-block`}
                style={{ width: '20%' }}
              ></div>
            ))}
          </div>
          <p className="text-xs text-gray-400">{passwordStrength.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
