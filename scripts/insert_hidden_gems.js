const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://daxghztyfchpkdjkguig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheGdoenR5ZmNocGtkamtndWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzUyNzUsImV4cCI6MjA4Nzg1MTI3NX0.vF99wRWNkWZcsqnTDL3dlACpHpF3GSpzlfUp6rdM_Ng'; // Anon Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'agentasT@th-ailand.com',
    password: 'agentasT321'
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  const gems = [
    { name: 'Koh Phayam', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Mak', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Kood', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Jum', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Libong', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Kradan', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Yao Noi', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Koh Phra Thong', description: 'Hidden Gem', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Nan', description: 'Hidden Gem - Northern Thailand', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true },
    { name: 'Khao Sok', description: 'Hidden Gem - National Park', stage: 'Idea', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400', is_hidden: true }
  ];

  // Using raw postgres since we need `is_hidden` column but let's check if the table has it.
  // The setup sql didn't have is_hidden. We can add it.
}
run();
