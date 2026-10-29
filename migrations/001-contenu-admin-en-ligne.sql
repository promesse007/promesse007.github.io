-- Configuration et photos gérées depuis l'administration en ligne.
-- Migration additive : ne touche pas aux souvenirs déjà reçus.
CREATE TABLE IF NOT EXISTS site_content (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_content_payload_object CHECK (jsonb_typeof(payload) = 'object')
);

CREATE TABLE IF NOT EXISTS site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL DEFAULT 'photo.jpg',
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
  file_data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_assets_file_size CHECK (octet_length(file_data) BETWEEN 1 AND 8388608)
);

CREATE INDEX IF NOT EXISTS site_assets_created_at_idx ON site_assets (created_at DESC);
