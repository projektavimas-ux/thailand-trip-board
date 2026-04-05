(function initStatusIndicator(global) {
  if (global.StatusIndicator) {
    return;
  }

  const VARIANT_CLASS_MAP = {
    default: ['bg-slate-100', 'text-slate-600', 'border-slate-200'],
    live: ['bg-emerald-50', 'text-emerald-700', 'border-emerald-200'],
    fallback: ['bg-amber-50', 'text-amber-700', 'border-amber-200'],
    error: ['bg-rose-50', 'text-rose-700', 'border-rose-200'],
    info: ['bg-sky-50', 'text-sky-700', 'border-sky-200']
  };

  const ALL_VARIANT_CLASSES = Array.from(
    new Set(Object.values(VARIANT_CLASS_MAP).flat())
  );

  const resolveElement = (ref, fallbackId) => {
    if (!ref && typeof fallbackId === 'string') {
      ref = fallbackId;
    }
    if (typeof HTMLElement !== 'undefined' && ref instanceof HTMLElement) {
      return ref;
    }
    if (typeof ref === 'string') {
      return document.getElementById(ref) || null;
    }
    return null;
  };

  const applyVariantClasses = (element, variant) => {
    if (!element || !element.classList) return;
    element.classList.remove(...ALL_VARIANT_CLASSES);
    const classes = VARIANT_CLASS_MAP[variant] || VARIANT_CLASS_MAP.default;
    element.classList.add(...classes);
  };

  const setText = (element, text) => {
    if (!element || typeof element.textContent === 'undefined') return;
    element.textContent = text ?? '';
  };

  const joinMeta = (primary = '', secondary = '') => {
    const parts = [primary, secondary].filter(Boolean);
    if (!parts.length) return '';
    return parts.join(' · ');
  };

  const formatTimestamp = (value, options = {}) => {
    if (!value) return '';
    const { locale = 'lt-LT', timeZone = 'Europe/Vilnius' } = options;
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    try {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone
      }).format(parsed);
    } catch (err) {
      return parsed.toLocaleString(locale, { timeZone });
    }
  };

  const create = (options = {}) => {
    const {
      badge,
      badgeId,
      meta,
      metaId,
      defaultBadge = 'Duomenys: tikrinama...',
      defaultMeta = 'Būsena: tikrinama...',
      defaultVariant = 'default'
    } = options;

    const badgeElement = resolveElement(badge, badgeId);
    const metaElement = resolveElement(meta, metaId);

    if (badgeElement && !badgeElement.dataset.indicatorDefaultApplied) {
      badgeElement.dataset.indicatorDefaultApplied = 'true';
      setText(badgeElement, defaultBadge);
      applyVariantClasses(badgeElement, defaultVariant);
    }
    if (metaElement && !metaElement.dataset.indicatorDefaultApplied) {
      metaElement.dataset.indicatorDefaultApplied = 'true';
      setText(metaElement, defaultMeta);
    }

    const setBadge = (text, variant = 'default') => {
      if (!badgeElement) return;
      setText(badgeElement, text);
      applyVariantClasses(badgeElement, variant);
    };

    const setMeta = (primary = '', secondary = '') => {
      if (!metaElement) return;
      const metaText = joinMeta(primary, secondary) || 'Būsena: neapibrėžta';
      setText(metaElement, metaText);
    };

    return {
      setBadge,
      setMeta,
      setStatus({ sourceLabel, variant = 'default', primary, secondary } = {}) {
        if (sourceLabel) {
          setBadge(sourceLabel, variant);
        }
        setMeta(primary, secondary);
      },
      markAwaitingAuth(message) {
        setBadge('Duomenys: Supabase (prisijunk)', 'fallback');
        setMeta('Režimas: laukia prisijungimo', message || 'Prisijunk, kad matytum live lentą');
      },
      markConfigMissing(message) {
        setBadge('Duomenys: Supabase konfigūracija nerasta', 'error');
        setMeta('Trūksta window.SUPABASE_URL / ANON_KEY', message || 'Papildyk supabase-config.js');
      },
      markError(label, detail) {
        setBadge(label || 'Duomenys: klaida', 'error');
        setMeta('Sistemos klaida', detail || 'Nežinoma klaida');
      },
      formatTimestamp
    };
  };

  global.StatusIndicator = { create, formatTimestamp };
})(typeof window !== 'undefined' ? window : globalThis);
