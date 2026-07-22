(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('.sr-only').textContent = 'Open navigation';
    document.body.classList.remove('nav-open');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
      document.body.classList.toggle('nav-open', open);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
      if (event.matches) closeNav();
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .2, .5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const legacyHashMap = {
    '#home': '#about',
    '#featured': '#work',
    '#portfolio': '#work',
    '#nba-projects': '#work',
    '#school-projects': 'archive.html',
    '#resume': '#resume'
  };
  const legacyTarget = legacyHashMap[window.location.hash];
  if (legacyTarget && legacyTarget !== window.location.hash) {
    if (legacyTarget.startsWith('#')) {
      window.history.replaceState(null, '', legacyTarget);
      window.requestAnimationFrame(() => document.querySelector(legacyTarget)?.scrollIntoView());
    } else {
      window.location.replace(legacyTarget);
    }
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
})();
