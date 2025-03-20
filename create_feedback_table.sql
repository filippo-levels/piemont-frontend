-- Create feedback table in piemontecnica-evaluation schema
CREATE TABLE IF NOT EXISTS criterio_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  similar_criterio_id TEXT NOT NULL,
  similar_filename TEXT NOT NULL,
  user_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to the table
COMMENT ON TABLE criterio_feedback IS 'Stores user feedback on similar criteria';

-- Create index on the main fields for faster lookups
CREATE INDEX idx_criterio_feedback_ids ON criterio_feedback (criterio_id, similar_criterio_id);
CREATE INDEX idx_criterio_feedback_filename ON criterio_feedback (filename);
CREATE INDEX idx_criterio_feedback_similar_filename ON criterio_feedback (similar_filename); 