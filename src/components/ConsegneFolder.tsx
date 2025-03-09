import React, { useState } from 'react';

interface Props {
  filename: string;
  onFileClick: (filename: string) => void;
}

export default function ConsegneFolder({ filename, onFileClick }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock data for folder contents
  const folderContents = [
    { id: 1, name: 'Documento 1.pdf', type: 'pdf' },
    { id: 2, name: 'Specifiche tecniche.docx', type: 'docx' },
    { id: 3, name: 'Planimetria.dwg', type: 'dwg' },
    { id: 4, name: 'Computo metrico.xlsx', type: 'xlsx' },
    { id: 5, name: 'Relazione tecnica.pdf', type: 'pdf' },
  ];
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'docx':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'xlsx':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="bg-gray-100 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="font-medium">{filename.replace('.json', '')}</span>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="p-3 space-y-2 bg-white">
          {folderContents.map((file) => (
            <div 
              key={file.id}
              className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
              onClick={() => onFileClick(`${filename.replace('.json', '')}/${file.name}`)}
            >
              {getFileIcon(file.type)}
              <span className="ml-2 text-sm">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 