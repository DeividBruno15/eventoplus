
-- Create a bucket for storing venue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('venue_images', 'Venue Images', true);

-- Set up a policy to allow authenticated users to upload images
CREATE POLICY "Allow users to upload venue images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'venue_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up a policy to allow public to view venue images
CREATE POLICY "Allow public to view venue images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'venue_images');
