
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, FileText, ChartPie } from 'lucide-react';
import { encryptionStats } from '@/utils/encryptionUtils';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  // Calculate the most common category
  let mostCommonCategory = 'none';
  let maxCount = 0;
  Object.entries(encryptionStats.categoryCount).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCategory = category;
    }
  });
  
  // Calculate percentage of sensitive content
  const sensitivePercentage = encryptionStats.totalOperations > 0 
    ? Math.round((encryptionStats.sensitiveContentDetected / encryptionStats.totalOperations) * 100) 
    : 0;
  
  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">Encryption Dashboard</h2>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
          <Shield className="h-3 w-3 mr-1" />
          <span>Analytics</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{encryptionStats.totalOperations}</p>
                <p className="text-xs text-gray-500 mt-1">Encryption and decryption operations</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Files Encrypted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{encryptionStats.filesEncrypted}</p>
                <p className="text-xs text-gray-500 mt-1">Total files securely encrypted</p>
              </div>
              <FileText className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Sensitive Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{sensitivePercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">Content flagged as sensitive</p>
              </div>
              <div className="w-16 h-16 relative">
                <ChartPie className="h-14 w-14 text-amber-500 opacity-80 absolute top-1 right-1" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500"
                  style={{ 
                    transform: `rotate(${sensitivePercentage * 3.6}deg)`,
                    transition: 'transform 1s ease-in-out'
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Most Common Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold capitalize">{mostCommonCategory}</p>
                <p className="text-xs text-gray-500 mt-1">Most frequently detected data type</p>
              </div>
              <Lock className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 text-center">
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
          <Shield className="h-3 w-3 mr-1" />
          <span>✅ 100% Client-Side Encryption (Zero Knowledge)</span>
        </Badge>
        <p className="text-xs text-gray-400 mt-2">
          Your data never leaves your browser. All encryption happens locally.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
