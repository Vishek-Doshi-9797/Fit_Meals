-- Fix image URLs in meals table to use proper asset paths
UPDATE meals 
SET image_url = CASE 
  WHEN name = 'Power Protein Shake' THEN '/src/assets/protein-shake.jpg'
  WHEN name = 'Fit Chicken Sandwich' THEN '/src/assets/healthy-sandwich.jpg'
  WHEN name = 'Acai Power Bowl' THEN '/src/assets/acai-bowl.jpg'
  ELSE image_url
END;

-- Update meals to ensure all have proper data
UPDATE meals 
SET 
  is_available = true,
  updated_at = now()
WHERE is_available IS NULL OR is_available = false;