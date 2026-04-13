const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// NOTE: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables before running
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  try {
    const dataPath = path.join(__dirname, '../data/places_catalog.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const catalog = JSON.parse(rawData);

    console.log('Parsed catalog, found items:', catalog.items ? catalog.items.length : 0);
    
    if (!catalog.items) {
      console.error('No items found in catalog');
      return;
    }

    const placesToInsert = catalog.items.map(item => ({
      slug: item.slug || item.id,
      title: item.title,
      cluster: item.cluster,
      status: item.status || 'idea'
    }));

    // Basic deduplication check by slug
    const uniquePlaces = [];
    const seenSlugs = new Set();
    for (const p of placesToInsert) {
      if (!seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        uniquePlaces.push(p);
      }
    }

    console.log('Inserting', uniquePlaces.length, 'unique places into Supabase...');

    const { data, error } = await supabase
      .from('places')
      .upsert(uniquePlaces, { onConflict: 'slug' });

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Successfully seeded places data.');
    }
  } catch (err) {
    console.error('Script failed:', err);
  }
}

if (require.main === module) {
  seed();
}

