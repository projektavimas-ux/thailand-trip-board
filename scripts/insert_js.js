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
    { name: 'Koh Phayam', description: 'Rami sala Andamanų jūroje, be automobilių, puikiai tinka atsipalaiduoti.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1544413164-9f8ce72782b5?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Mak', description: 'Maža, ekologiška sala netoli Koh Chang, puikūs paplūdimiai ir ramybė.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Kood', description: 'Viena gražiausių Tailando salų su džiunglėmis, kriokliais ir laukiniais paplūdimiais.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1548118029-79a83ebba1a1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Jum', description: 'Autentiška sala Krabi regione, be minių, su ramiu vietiniu gyvenimu.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Libong', description: 'Didžiausia Trang regiono sala, garsi jūros karvėmis (dugongais) ir nepaliesta gamta.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1510658700206-8dceaa10fbe0?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Kradan', description: 'Sala su vienu gražiausių pasaulio paplūdimių, puikus paviršinis nardymas.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Yao Noi', description: 'Rami sala Phang Nga įlankoje su įspūdingais kalkakmenio uolų vaizdais.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1528643564070-bbbd93d8b5bc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Koh Phra Thong', description: 'Savana primenanti sala Andamanų jūroje su apleistais paplūdimiais.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Nan', description: 'Šiaurės Tailando provincija, garsėjanti senovinėmis šventyklomis, kalnais ir ramia atmosfera.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1596443603415-3855a805cc06?auto=format&fit=crop&q=80&w=600' },
    { name: 'Khao Sok', description: 'Seniausias pasaulio atogrąžų miškas, garsėjantis milžinišku Cheow Lan ežeru.', stage: 'Slapta vieta', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600' }
  ];

  for (let gem of gems) {
    const { data: existing } = await supabase.from('places').select('id').eq('name', gem.name);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('places').insert([gem]);
      if (error) console.error('Insert error for', gem.name, error);
      else console.log('Inserted:', gem.name);
    } else {
      console.log('Exists:', gem.name);
    }
  }
}
run();
