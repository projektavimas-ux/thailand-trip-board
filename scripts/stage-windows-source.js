(function initStageWindowsSource(global) {
  if (global.StageWindowsSource) {
    return;
  }

  function computeLatestTimestamp(list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list.reduce((latest, current) => {
      const candidate = current ? (current.updated_at || current.inserted_at || current.updatedAt || current.insertedAt) : null;
      if (!candidate) return latest;
      if (!latest) return candidate;
      return new Date(candidate) > new Date(latest) ? candidate : latest;
    }, null);
  }

  function normalizeStageRow(row = {}) {
    return {
      stage: row.stage || '',
      window: row.window_label || row.window || row.label || '',
      start_day: row.start_day,
      end_day: row.end_day,
      focus: row.focus || row.summary || ''
    };
  }

  async function fetchFromSupabase(client) {
    if (!client) return { items: [], error: null };
    try {
      const { data, error } = await client
        .from('stage_windows')
        .select('stage, window_label, window, start_day, end_day, focus, order_index, inserted_at, updated_at')
        .order('order_index', { ascending: true })
        .order('start_day', { ascending: true });
      if (error) throw error;
      const items = Array.isArray(data) ? data.map(normalizeStageRow) : [];
      return { items, updatedAt: computeLatestTimestamp(data || []), sourceLabel: 'Supabase · stage_windows', variant: 'live' };
    } catch (err) {
      console.warn('[StageWindowsSource] Supabase klaida', err);
      return { items: [], error: err };
    }
  }

  async function fetchFromFallback(url) {
    const target = url || './data/stage_windows.json';
    try {
      const payload = await fetch(`${target}${target.includes('?') ? '&' : '?'}v=${Date.now()}`)
        .then(res => res.json());
      let items = [];
      if (Array.isArray(payload)) {
        items = payload;
      } else if (payload && Array.isArray(payload.items)) {
        items = payload.items;
      }
      return {
        items: items.map(normalizeStageRow),
        updatedAt: payload?.updated_at || payload?.updatedAt || null,
        sourceLabel: target,
        variant: 'fallback'
      };
    } catch (err) {
      console.error('[StageWindowsSource] Fallback klaida', err);
      return { items: [], error: err };
    }
  }

  async function fetchStageWindows(options = {}) {
    const {
      client = null,
      fallbackUrl = './data/stage_windows.json'
    } = options;

    const supabaseResult = await fetchFromSupabase(client);
    if (supabaseResult.items?.length) {
      return supabaseResult;
    }

    const fallbackResult = await fetchFromFallback(fallbackUrl);
    if (fallbackResult.items?.length) {
      return fallbackResult;
    }

    return {
      items: [],
      sourceLabel: supabaseResult.sourceLabel || fallbackResult.sourceLabel || 'stage_windows',
      variant: supabaseResult.items?.length ? supabaseResult.variant : 'error',
      updatedAt: supabaseResult.updatedAt || fallbackResult.updatedAt || null,
      error: supabaseResult.error || fallbackResult.error || new Error('Nepavyko užkrauti stage_windows')
    };
  }

  global.StageWindowsSource = { fetch: fetchStageWindows };
})(typeof window !== 'undefined' ? window : globalThis);
