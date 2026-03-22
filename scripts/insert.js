const { Client } = require('pg');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const client = new Client({
  connectionString: 'postgresql://postgres:LQ4vBERAdoYeznJi@db.daxghztyfchpkdjkguig.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    
    // 1. Pridėti is_hidden stulpelį, jei nėra
    await client.query(`ALTER TABLE places ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false;`);
    
    // 2. Slaptų vietų sąrašas pagal Ernesto pageidavimą
    const gems = [
      { name: 'Koh Phayam', description: 'Rami sala Andamanų jūroje, be automobilių, puikiai tinka atsipalaiduoti.' },
      { name: 'Koh Mak', description: 'Maža, ekologiška sala netoli Koh Chang, puikūs paplūdimiai ir ramybė.' },
      { name: 'Koh Kood', description: 'Viena gražiausių Tailando salų su džiunglėmis, kriokliais ir laukiniais paplūdimiais.' },
      { name: 'Koh Jum', description: 'Autentiška sala Krabi regione, be minių, su ramiu vietiniu gyvenimu.' },
      { name: 'Koh Libong', description: 'Didžiausia Trang regiono sala, garsi jūros karvėmis (dugongais) ir nepaliesta gamta.' },
      { name: 'Koh Kradan', description: 'Sala su vienu gražiausių pasaulio paplūdimių, puikus paviršinis nardymas.' },
      { name: 'Koh Yao Noi', description: 'Rami sala Phang Nga įlankoje su įspūdingais kalkakmenio uolų vaizdais.' },
      { name: 'Koh Phra Thong', description: 'Savana primenanti sala Andamanų jūroje su apleistais paplūdimiais.' },
      { name: 'Nan', description: 'Šiaurės Tailando provincija, garsėjanti senovinėmis šventyklomis, kalnais ir ramia atmosfera.' },
      { name: 'Khao Sok', description: 'Seniausias pasaulio atogrąžų miškas, garsėjantis milžinišku Cheow Lan ežeru.' }
    ];

    for (let gem of gems) {
      const res = await client.query('SELECT id FROM places WHERE name = $1', [gem.name]);
      if (res.rowCount === 0) {
        await client.query(
          'INSERT INTO places (name, description, stage, is_hidden) VALUES ($1, $2, $3, $4)',
          [gem.name, gem.description, 'Idea', true]
        );
        console.log(`Įtraukta: ${gem.name}`);
      } else {
        await client.query(
          'UPDATE places SET is_hidden = true WHERE name = $1',
          [gem.name]
        );
        console.log(`Atnaujinta: ${gem.name}`);
      }
    }
    
    console.log('Duomenų bazė atnaujinta sėkmingai!');
  } catch (err) {
    console.error('Klaida:', err);
  } finally {
    await client.end();
  }
}

run();
