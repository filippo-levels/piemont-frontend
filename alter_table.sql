-- Add similar_filename column to existing criterio_feedback table
ALTER TABLE criterio_feedback 
ADD COLUMN similar_filename TEXT;

-- Update column to be NOT NULL for new records
-- First we need to set a value for existing records
UPDATE criterio_feedback 
SET similar_filename = filename 
WHERE similar_filename IS NULL;

-- Now make it NOT NULL
ALTER TABLE criterio_feedback 
ALTER COLUMN similar_filename SET NOT NULL;

-- Create index for the new column
CREATE INDEX idx_criterio_feedback_similar_filename ON criterio_feedback (similar_filename); 