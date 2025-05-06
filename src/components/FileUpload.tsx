
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: {
      'text/*': [],
      'application/pdf': [],
      'application/json': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    }
  });
  
  return (
    <div 
      {...getRootProps()} 
      className={cn(
        'file-drop-area',
        isDragging || isDragActive ? 'active' : 'border-gray-600',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <Upload className="h-10 w-10 text-gray-400" />
        <p className="text-gray-300">Drag & drop a file here, or click to select a file</p>
        <p className="text-xs text-gray-400">
          Supported files: Text files, PDFs, Word documents, Excel sheets, JSON
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
