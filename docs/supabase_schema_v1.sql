-- Supabase Schema for Thailand Trip Board
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    place_id TEXT NOT NULL,
    vote_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS places (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    cluster TEXT,
    status TEXT DEFAULT 'idea',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Public read access for places" ON places FOR SELECT USING (true);

