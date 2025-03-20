import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage key for upload analysis result
const STORAGE_KEY = 'uploadAnalysisResult';

// Interface for feedback data
export interface CriterioFeedbackData {
  filename: string;
  criterio_id: string;
  similar_criterio_id: string;
  similar_filename: string;
  user_comment: string;
}

/**
 * Submit feedback for a criterio
 * @param feedbackData The feedback data to submit
 * @returns Object containing error if submission failed
 */
export const submitCriterioFeedback = async (feedbackData: CriterioFeedbackData) => {
  try {
    const { error } = await supabase
      .from('criterio_feedback')
      .insert(feedbackData);
    
    return { error };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { error };
  }
};

/**
 * Extract filename from criterio ID or filename
 * @param input The criterio ID or filename 
 * @returns The extracted filename without .json extension
 */
export const extractFilename = (input: string): string => {
  // If input contains a dash, it's likely a criterio ID (format: filename-criterioid)
  if (input.includes('-')) {
    return input.split('-')[0]; // Get the part before the first dash
  }
  
  // If it's already a filename, remove .json extension if present
  return input.replace('.json', '');
};

/**
 * Get the original uploaded filename from localStorage
 * @returns The original filename or null if not found
 */
export const getOriginalFilename = (): string | null => {
  try {
    const savedResult = localStorage.getItem(STORAGE_KEY);
    if (savedResult) {
      const jsonResult = JSON.parse(savedResult);
      return jsonResult.file_name || null;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving original filename:', error);
    return null;
  }
}; 