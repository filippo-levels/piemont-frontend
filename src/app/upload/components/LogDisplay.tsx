import React from 'react';

interface LogDisplayProps {
  currentLog: string;
  showElapsedTime: boolean;
  currentElapsedTime: number;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ 
  currentLog, 
  showElapsedTime, 
  currentElapsedTime 
}) => {
  if (!currentLog) return null;
  
  return (
    <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-sm text-gray-600">
      <div className="flex justify-between items-center">
        {currentLog}
        {showElapsedTime && currentElapsedTime > 0 && (
          <div className="px-2 py-1 bg-[#3dcab1]/10 text-[#3dcab1] rounded-md text-xs font-medium ml-2">
            {currentElapsedTime.toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDisplay; 