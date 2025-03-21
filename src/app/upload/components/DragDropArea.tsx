import React, { useRef, useState, useCallback } from 'react';

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
      className={`relative group flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg
        border-2 border-dashed transition-all duration-300 cursor-pointer shadow-sm
        ${isDragging 
          ? "border-[#3dcab1] bg-[#3dcab1]/10 shadow-md" 
          : file 
            ? "border-[#3dcab1] bg-[#3dcab1]/5" 
            : "border-gray-300 hover:border-[#3dcab1] hover:bg-gray-50"
        }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full justify-center text-center sm:text-left">
        {file ? (
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 text-[#3dcab1]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
        ) : (
          <div className={`p-4 rounded-full ${isDragging ? "bg-[#3dcab1]/20" : "bg-gray-100"} transition-colors`}>
            <svg 
              className={`w-10 h-10 sm:w-12 sm:h-12 ${isDragging ? "text-[#3dcab1]" : "text-gray-400"}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        )}
        
        {file ? (
          <div className="flex flex-col bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto">
            <p className="text-base sm:text-lg font-medium text-gray-800 break-all sm:break-normal">{file.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#3dcab1]/10 text-[#3dcab1] rounded text-xs font-medium">PDF</span>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-base sm:text-lg font-semibold text-gray-700">
              {isDragging ? "Rilascia qui il file" : "Trascina qui il tuo PDF"}
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              oppure clicca per selezionare (solo file PDF)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropArea; 