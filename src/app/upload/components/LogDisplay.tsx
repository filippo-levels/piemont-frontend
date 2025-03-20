import React, { useEffect, useState } from 'react';
import { Timer, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [icon, setIcon] = useState<React.ReactNode | null>(null);
  const [colorClass, setColorClass] = useState('');
  
  useEffect(() => {
    if (!currentLog) return;
    
    if (currentLog.includes('✅')) {
      setIcon(<CheckCircle2 className="h-4 w-4 text-green-500" />);
      setColorClass('text-green-700 bg-green-50 border-green-100');
    } else if (currentLog.includes('❌') || currentLog.includes('⚠️')) {
      setIcon(<AlertCircle className="h-4 w-4 text-amber-500" />);
      setColorClass('text-amber-700 bg-amber-50 border-amber-100');
    } else if (currentLog.includes('⌛')) {
      setIcon(<Timer className="h-4 w-4 text-primary animate-pulse" />);
      setColorClass('text-primary-700 bg-primary/5 border-primary/10');
    } else if (currentLog.includes('📄')) {
      setIcon(<FileText className="h-4 w-4 text-blue-500" />);
      setColorClass('text-blue-700 bg-blue-50 border-blue-100');
    } else {
      setIcon(null);
      setColorClass('text-foreground bg-muted/50 border-border');
    }
  }, [currentLog]);
  
  if (!currentLog) return null;
  
  // Remove emoji from log message for cleaner display
  const cleanLog = currentLog.replace(/[^\x00-\x7F]/g, '').trim();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentLog}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-2 p-3 border rounded-lg text-sm ${colorClass}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon}
            <span>{cleanLog}</span>
          </div>
          {showElapsedTime && currentElapsedTime > 0 && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium ml-2 flex items-center gap-1"
            >
              <Timer className="h-3 w-3" />
              {currentElapsedTime.toFixed(2)}s
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogDisplay; 