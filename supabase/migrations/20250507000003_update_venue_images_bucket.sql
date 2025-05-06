
-- Check if the bucket exists first
DO $$
DECLARE
    bucket_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'venue_images'
    ) INTO bucket_exists;

    IF NOT bucket_exists THEN
        -- Create the bucket if it doesn't exist
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('venue_images', 'Venue Images', true);
        
        -- Set up policies
        EXECUTE 'CREATE POLICY "Allow users to upload venue images" ON storage.objects FOR INSERT TO authenticated USING (bucket_id = ''venue_images'' AND auth.uid()::text = (storage.foldername(name))[1])';
        
        EXECUTE 'CREATE POLICY "Allow everyone to view venue images" ON storage.objects FOR SELECT USING (bucket_id = ''venue_images'')';
        
        EXECUTE 'CREATE POLICY "Allow users to update their own venue images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = ''venue_images'' AND auth.uid()::text = (storage.foldername(name))[1])';
        
        EXECUTE 'CREATE POLICY "Allow users to delete their own venue images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = ''venue_images'' AND auth.uid()::text = (storage.foldername(name))[1])';
    ELSE
        -- If the bucket exists, make sure the policies are correct
        -- Check if the select policy exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname LIKE '%view venue images%'
        ) THEN
            EXECUTE 'CREATE POLICY "Allow everyone to view venue images" ON storage.objects FOR SELECT USING (bucket_id = ''venue_images'')';
        END IF;
    END IF;
END $$;
