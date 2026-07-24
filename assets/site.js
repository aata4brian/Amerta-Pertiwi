(() => {
  'use strict';

  const whatsappNumber = '6281234567890'; // Ganti dengan nomor resmi pusat informasi.
  const defaultMessage = 'Halo Pusat Informasi Desa Wisata Patakbanteng, saya ingin menanyakan informasi wisata.';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, value)}%`;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);

    const heroShell = document.querySelector('.hero-shell, .page-hero-shell');
    if (heroShell && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroShell.style.setProperty('--parallax-y', `${Math.min(32, window.scrollY * 0.045)}px`);
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }));
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
  });

  const createWhatsAppUrl = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
  document.querySelectorAll('[data-wa]').forEach((link) => {
    const message = link.dataset.message || defaultMessage;
    link.setAttribute('href', createWhatsAppUrl(message));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  const waFloat = document.createElement('a');
  waFloat.className = 'wa-float';
  waFloat.href = createWhatsAppUrl(defaultMessage);
  waFloat.target = '_blank';
  waFloat.rel = 'noopener noreferrer';
  waFloat.setAttribute('aria-label', 'Hubungi pusat informasi melalui WhatsApp');
  waFloat.innerHTML = '<span>WA</span>';
  document.body.appendChild(waFloat);

  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector?.startsWith('#')) return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const targetId = group.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;
    const items = [...target.querySelectorAll('[data-category]')];

    group.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        items.forEach((item) => {
          const categories = (item.dataset.category || '').split(/\s+/);
          const visible = filter === 'all' || categories.includes(filter);
          item.classList.toggle('is-hidden', !visible);
        });
      });
    });
  });

  document.querySelectorAll('[data-search-target]').forEach((input) => {
    const target = document.getElementById(input.dataset.searchTarget);
    if (!target) return;
    const items = [...target.querySelectorAll('[data-searchable]')];
    input.addEventListener('input', () => {
      const query = input.value.trim().toLocaleLowerCase('id');
      items.forEach((item) => {
        const matched = item.textContent.toLocaleLowerCase('id').includes(query);
        item.classList.toggle('is-hidden', !matched);
      });
    });
  });

  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;
      const original = button.textContent;
      button.textContent = 'Pesan siap diteruskan';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
      }, 2200);
    });
  });

  const revealTargets = [...document.querySelectorAll('.section-head, .card, .need-card, .detail-panel, .map-card, .contact-panel, .form-card, .timeline-item, .nursery-feature')];
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.dataset.delay = String(index % 4 + 1);
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('in-view'));
  }

  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-7px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
    img.decoding = 'async';
  });
})();
