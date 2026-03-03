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

    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || window.SUPABASE_URL.includes('YOUR_')) {
      show(configBox);
      hide(authBox);
      hide(appBox);
      if (status) status.textContent = '';
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
        if (typeof opts.onSignedOut === 'function') opts.onSignedOut({ client });
      } else {
        hide(authBox);
        show(appBox);
        if (who) who.textContent = 'Prisijungęs: ' + (user.email || user.id);
        if (typeof opts.onReady === 'function') opts.onReady({ client, user });
      }
    }

    async function handleAuth(action){
      if (!emailInput || !passInput) return;
      const email = emailInput.value.trim();
      const password = passInput.value;
      if (!email || !password){
        if (status) status.textContent = 'Įvesk el. paštą ir slaptažodį';
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
      }
    }

    loginBtn && loginBtn.addEventListener('click', () => handleAuth('login'));
    signupBtn && signupBtn.addEventListener('click', () => handleAuth('signup'));
    logoutBtn && logoutBtn.addEventListener('click', async () => {
      await client.auth.signOut();
      await refresh();
    });
    passInput && passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAuth('login');
    });

    refresh();
    return { client, refresh };
  };
})();
