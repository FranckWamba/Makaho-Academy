// MAKAHO Academy — navigation, filtres, formulaires, micro-interactions
(() => {
  const WA_NUMBER = '237674172225'; // WhatsApp d'inscription (MTN MoMo)
  const PAY = {
    'MTN MoMo': { num: '674 17 22 25', color: 'bg-yellow-400 text-tech' },
    'Orange Money': { num: '696 67 30 09', color: 'bg-orange-500 text-white' },
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- En-tête & menu mobile ---------- */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    menuBtn.addEventListener('click', () => setMenu(menu.hidden));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Apparition au défilement, compteurs, jauge ---------- */
  const animateCount = (el) => {
    const end = parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = end; return; }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const watch = $$('.reveal, [data-count], .ratio-bar');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('visible', 'go');
        if (el.dataset.count) animateCount(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    watch.forEach((el) => io.observe(el));
  } else {
    watch.forEach((el) => { el.classList.add('visible', 'go'); if (el.dataset.count) el.textContent = el.dataset.count; });
  }

  /* ---------- Halo qui suit le curseur ---------- */
  $$('.spot').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Mockup smartphone (accueil) ---------- */
  const tabs = $$('.phone-tab');
  const panes = $$('.phone-pane');
  if (tabs.length) {
    let current = 0, timer;
    const show = (i) => {
      current = i;
      tabs.forEach((t, k) => t.classList.toggle('on', k === i));
      panes.forEach((p, k) => p.classList.toggle('on', k === i));
    };
    const auto = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show((current + 1) % tabs.length), 5000); };
    tabs.forEach((t, i) => t.addEventListener('click', () => { show(i); auto(); }));
    show(0); auto();
    const likes = $('#likes');
    if (likes) {
      let n = 12400;
      $('#like-btn')?.addEventListener('click', () => {
        n += 1; likes.textContent = n.toLocaleString('fr-FR');
        const h = document.createElement('span');
        h.className = 'heart absolute text-lg'; h.textContent = '❤️'; h.style.right = `${10 + Math.random() * 20}px`; h.style.bottom = '90px';
        $('#like-layer').appendChild(h); setTimeout(() => h.remove(), 3000);
      });
    }
  }

  /* ---------- Filtres du catalogue ---------- */
  const filterBtns = $$('[data-filter]');
  const courses = $$('.course');
  if (filterBtns.length && courses.length) {
    const search = $('#course-search');
    const counter = $('#result-count');
    const empty = $('#no-result');
    let active = 'all';

    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    const apply = () => {
      const q = search ? norm(search.value.trim()) : '';
      let shown = 0;
      courses.forEach((c) => {
        const okCat = active === 'all' || c.dataset.cat.split(' ').includes(active);
        const okText = !q || norm(c.textContent).includes(q);
        const visible = okCat && okText;
        if (visible && c.classList.contains('is-hidden') && !reduceMotion) {
          c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 500);
        }
        c.classList.toggle('is-hidden', !visible);
        if (visible) shown += 1;
      });
      $$('.course-group').forEach((g) => { g.hidden = !$$('.course:not(.is-hidden)', g).length; });
      if (counter) counter.textContent = `${shown} formation${shown > 1 ? 's' : ''}`;
      if (empty) empty.hidden = shown !== 0;
    };

    const setFilter = (f) => {
      active = f;
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
      apply();
    };

    filterBtns.forEach((b) => {
      const n = b.dataset.filter === 'all' ? courses.length : courses.filter((c) => c.dataset.cat.split(' ').includes(b.dataset.filter)).length;
      const span = document.createElement('span'); span.className = 'count'; span.textContent = n; b.appendChild(span);
      b.addEventListener('click', () => { setFilter(b.dataset.filter); history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : `#${b.dataset.filter}`); });
    });
    search?.addEventListener('input', apply);
    $('#reset-filters')?.addEventListener('click', () => { if (search) search.value = ''; setFilter('all'); });

    const fromHash = () => {
      const h = location.hash.slice(1);
      return filterBtns.some((b) => b.dataset.filter === h) ? h : 'all';
    };
    setFilter(fromHash());
    window.addEventListener('hashchange', () => setFilter(fromHash()));
  }

  /* ---------- Formulaires → WhatsApp ---------- */
  const openWhatsApp = (lines) => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  };

  const setupForm = (form, buildMessage) => {
    const errorBox = $('.form-error', form);
    const val = (n) => (form.elements[n] ? form.elements[n].value.trim() : '');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.field', form).forEach((f) => f.classList.remove('invalid'));
      let error = '';
      for (const f of $$('[required]', form)) {
        if (!f.value.trim()) { error = 'Merci de remplir les champs marqués d\'un *.'; f.classList.add('invalid'); break; }
      }
      const tel = form.elements.tel;
      if (!error && tel && tel.value.replace(/\D/g, '').length < 8) { error = 'Merci de saisir un numéro de téléphone valide.'; tel.classList.add('invalid'); }
      const mail = form.elements.email;
      if (!error && mail && mail.value && !/^\S+@\S+\.\S+$/.test(mail.value)) { error = 'Adresse e-mail invalide.'; mail.classList.add('invalid'); }
      if (error) {
        errorBox.textContent = error; errorBox.hidden = false;
        const bad = $('.invalid', form); if (bad) bad.focus();
        return;
      }
      errorBox.hidden = true;
      openWhatsApp(buildMessage(val, form));
    });
  };

  const regForm = $('#reg-form');
  if (regForm) {
    // Présélection depuis ?formation=
    const wanted = new URLSearchParams(location.search).get('formation');
    const sel = regForm.elements.formation;
    if (wanted && sel) {
      const opt = $$('option', sel).find((o) => o.dataset.slug === wanted);
      if (opt) sel.value = opt.value;
    }
    // Info de paiement dynamique
    const payInfo = $('#pay-info');
    const updatePay = () => {
      const m = regForm.querySelector('input[name="paiement"]:checked').value;
      payInfo.innerHTML = `<span class="w-10 h-10 shrink-0 rounded-full grid place-items-center font-black text-[10px] ${PAY[m].color}">${m === 'MTN MoMo' ? 'MoMo' : 'OM'}</span><span>Envoyez le montant au <strong class="text-tech">${PAY[m].num}</strong> (${m}), puis joignez la capture dans WhatsApp pour confirmer votre place.</span>`;
    };
    $$('input[name="paiement"]', regForm).forEach((r) => r.addEventListener('change', updatePay));
    updatePay();

    setupForm(regForm, (v) => {
      const lines = [
        'Bonjour MAKAHO Academy 👋',
        'Je souhaite candidater à une formation.',
        '',
        `🎓 Formation : ${v('formation')}`,
        `🧭 Mode : ${v('mode')}`,
        `👤 Nom : ${v('nom')}`,
        `📞 Téléphone/WhatsApp : ${v('tel')}`,
      ];
      if (v('email')) lines.push(`✉️ E-mail : ${v('email')}`);
      lines.push(`🌍 Pays / Ville : ${v('pays')}${v('ville') ? ' — ' + v('ville') : ''}`);
      lines.push(`📈 Niveau : ${v('niveau')}`);
      lines.push(`💳 Paiement prévu : ${regForm.querySelector('input[name="paiement"]:checked').value}`);
      if (v('message')) lines.push('', `💬 ${v('message')}`);
      return lines;
    });
  }

  const b2bForm = $('#b2b-form');
  if (b2bForm) {
    setupForm(b2bForm, (v) => {
      const lines = [
        'Bonjour MAKAHO Academy 👋',
        'Demande de devis — Offre Entreprises (B2B).',
        '',
        `🏢 Entreprise : ${v('entreprise')}`,
        `👤 Contact : ${v('nom')}`,
        `📞 Téléphone : ${v('tel')}`,
      ];
      if (v('email')) lines.push(`✉️ E-mail : ${v('email')}`);
      lines.push(`🎯 Besoin : ${v('besoin')}`, `👥 Équipe : ${v('equipe')}`);
      if (v('message')) lines.push('', `💬 ${v('message')}`);
      return lines;
    });
  }

  /* ---------- Mentions légales ---------- */
  const modal = $('#legal-modal');
  if (modal) {
    const toggle = (open) => {
      modal.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      (open ? $('#legal-close') : $('#legal-btn')).focus();
    };
    $('#legal-btn').addEventListener('click', () => toggle(true));
    $('#legal-close').addEventListener('click', () => toggle(false));
    modal.addEventListener('click', (e) => { if (e.target === modal) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) toggle(false); });
  }
})();
