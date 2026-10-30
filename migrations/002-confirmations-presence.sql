-- Réponses privées des invités et enfants des mariés gérés par l'administration.
-- Migration additive : les souvenirs, la configuration et les anciens invités restent intacts.
CREATE TABLE IF NOT EXISTS confirmations_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL CHECK (char_length(nom) BETWEEN 1 AND 100),
  telephone text NOT NULL DEFAULT '' CHECK (char_length(telephone) <= 40),
  cote text NOT NULL CHECK (cote IN ('famille_josiane', 'famille_armand', 'amis')),
  presence text NOT NULL CHECK (presence IN ('oui', 'non', 'attente')),
  adultes smallint NOT NULL DEFAULT 1 CHECK (adultes BETWEEN 0 AND 20),
  enfants jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(enfants) = 'array' AND jsonb_array_length(enfants) <= 12),
  cree_le timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS confirmations_presence_cree_le_idx
  ON confirmations_presence (cree_le DESC);

CREATE TABLE IF NOT EXISTS enfants_maries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL CHECK (char_length(nom) BETWEEN 1 AND 60),
  cote text NOT NULL CHECK (cote IN ('josiane', 'armand')),
  age smallint CHECK (age BETWEEN 0 AND 30),
  cree_le timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enfants_maries_cote_idx ON enfants_maries (cote, cree_le);
