(function(){
  function $(id){ return document.getElementById(id); }
  function show(el){ el && el.classList.remove('hidden'); }
  function hide(el){ el && el.classList.add('hidden'); }

  window.initSupabasePage = function(options){
    const opts = options || {};
    const configBox = $('configBox');
    const authBox = $('authBox');
    const appBox = $('appBox');
    const who = $('who');
    const status = $('authStatus');
    const emailInput = $('emailInput');
    const passInput = $('passInput');
    const loginBtn = $('loginBtn');
    const signupBtn = $('signupBtn');
    const logoutBtn = $('logoutBtn');
    const indicator = (function setupIndicator(){
      if (!window.StatusIndicator) return null;
      const indicatorOpts = opts.indicator || {};
      const badgeElement = indicatorOpts.badge
        || (indicatorOpts.badgeSelector ? document.querySelector(indicatorOpts.badgeSelector) : null)
        || document.querySelector('[data-supabase-badge]')
        || $('supabaseStatusBadge');
      const metaElement = indicatorOpts.meta
        || (indicatorOpts.metaSelector ? document.querySelector(indicatorOpts.metaSelector) : null)
        || document.querySelector('[data-supabase-meta]')
        || $('supabaseStatusMeta');
      return window.StatusIndicator.create({
        badge: badgeElement,
        meta: metaElement,
        defaultBadge: indicatorOpts.defaultBadge || 'Duomenys: tikrinama...',
        defaultMeta: indicatorOpts.defaultMeta || 'Supabase būsena tikrinama...'
      });
    })();

    const setIndicatorConfigMissing = () => {
      indicator?.markConfigMissing('Papildyk supabase-config.js');
    };

    const setIndicatorAwaitingAuth = () => {
      indicator?.markAwaitingAuth('Prisijunk, kad matytum live lentą');
    };

    const setIndicatorSignedOut = () => {
      indicator?.setStatus({
        sourceLabel: 'Duomenys: Supabase',
        variant: 'fallback',
        primary: 'Režimas: atjungta',
        secondary: 'Prisijunk, kad krautų duomenis'
      });
    };

    const setIndicatorReady = (user) => {
      indicator?.setStatus({
        sourceLabel: 'Duomenys: Supabase',
        variant: 'live',
        primary: 'Režimas: prisijungta',
        secondary: user?.email || user?.id || 'Live'
      });
    };

    const setIndicatorError = (message) => {
      indicator?.markError('Duomenys: Supabase klaida', message || 'Nežinoma klaida');
    };

    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_URL.includes('YOUR_')) {
      show(configBox);
      hide(authBox);
      hide(appBox);
      if (status) status.textContent = '';
      setIndicatorConfigMissing();
      return null;
    }

    hide(configBox);
    const client = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    async function refresh(){
      if (status) status.textContent = '';
      const { data } = await client.auth.getUser();
      const user = data?.user || null;
      if (!user) {
        show(authBox);
        hide(appBox);
        if (who) who.textContent = '';
        setIndicatorSignedOut();
        if (typeof opts.onSignedOut === 'function') opts.onSignedOut({ client });
      } else {
        hide(authBox);
        show(appBox);
        if (who) who.textContent = 'Prisijungęs: ' + (user.email || user.id);
        setIndicatorReady(user);
        if (typeof opts.onReady === 'function') opts.onReady({ client, user });
      }
    }

    async function handleAuth(action){
      if (!emailInput || !passInput) return;
      const email = emailInput.value.trim();
      const password = passInput.value;
      if (!email || !password){
        if (status) status.textContent = 'Įvesk el. paštą ir slaptažodį';
        setIndicatorAwaitingAuth();
        return;
      }
      try {
        if (action === 'login') {
          const { error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else if (action === 'signup') {
          const { error } = await client.auth.signUp({ email, password });
          if (error) throw error;
        }
        await refresh();
      } catch (err) {
        if (status) status.textContent = err.message || 'Nepavyko';
        setIndicatorError(err?.message);
      }
    }

    loginBtn && loginBtn.addEventListener('click', () => handleAuth('login'));
    signupBtn && signupBtn.addEventListener('click', () => handleAuth('signup'));
    logoutBtn && logoutBtn.addEventListener('click', async () => {
      await client.auth.signOut();
      setIndicatorSignedOut();
      await refresh();
    });
    passInput && passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAuth('login');
    });

    refresh();
    return { client, refresh };
  };
})();
