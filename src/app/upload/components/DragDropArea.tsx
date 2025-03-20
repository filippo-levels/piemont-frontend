import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DragDropAreaProps {
  onFileSelect: (file: File) => void;
  file: File | null;
}

const DragDropArea: React.FC<DragDropAreaProps> = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileSelect(droppedFile);
      
      if (fileInputRef.current) {
        // Create a new DataTransfer to update the file input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, [onFileSelect]);

  return (
    <div 
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group flex flex-col items-center justify-center p-8 rounded-lg
        border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragging 
          ? "border-primary bg-primary/5" 
          : file 
            ? "border-primary/50 bg-primary/5" 
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
        }
      `}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center text-center gap-3 w-full justify-center">
        {file ? (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-medium text-primary">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-2">
              <Upload 
                className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} 
              />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-medium">
                {isDragging ? "Rilascia qui il file" : "Trascina qui il tuo PDF"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                oppure clicca per selezionare
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Solo file PDF supportati
              </p>
            </div>
          </>
        )}

        {/* Animated ring for while dragging */}
        {isDragging && (
          <div className="absolute inset-0 border-4 border-primary/30 rounded-lg animate-pulse pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default DragDropArea; 