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
  
  // Helper to determine if the log contains specific message types
  const isError = currentLog.includes('❌') || currentLog.includes('⚠️');
  const isSuccess = currentLog.includes('✅');
  const isLoading = currentLog.includes('⌛');
  
  // Determine background color based on message type
  const getBgColor = () => {
    if (isError) return 'bg-red-50 border-red-100';
    if (isSuccess) return 'bg-green-50 border-green-100';
    if (isLoading) return 'bg-blue-50 border-blue-100';
    return 'bg-gray-50 border-gray-100';
  };
  
  return (
    <div className={`p-3 sm:p-4 ${getBgColor()} border rounded-lg shadow-sm transition-all`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="text-sm sm:text-base font-medium break-words">{currentLog}</div>
        {showElapsedTime && currentElapsedTime > 0 && (
          <div className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-semibold sm:ml-3 flex items-center gap-1.5 shadow-sm w-fit whitespace-nowrap">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {currentElapsedTime.toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDisplay; 