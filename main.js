// MAKAHO Academy — interactions
(() => {
  const WHATSAPP_NUMBER = '237674172225';
  const $ = (s, r = document) => r.querySelector(s);

  // Menu mobile
  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Année du pied de page
  $('#year').textContent = new Date().getFullYear();

  // Apparition au défilement
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  // Les boutons de tarif présélectionnent la formule
  document.querySelectorAll('.plan-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      document.querySelectorAll('input[name="formule"]').forEach((r) => {
        r.checked = r.value.startsWith(plan);
      });
    });
  });

  // Formulaire → WhatsApp
  const form = $('#reg-form');
  const errorBox = $('#form-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => form.elements[id].value.trim();
    const nom = val('nom');
    const tel = val('tel');
    const digits = tel.replace(/\D/g, '');

    ['nom', 'tel'].forEach((id) => form.elements[id].classList.remove('invalid'));
    let error = '';
    if (nom.length < 2) { error = 'Veuillez saisir votre nom complet.'; form.elements.nom.classList.add('invalid'); }
    else if (digits.length < 8) { error = 'Veuillez saisir un numéro de téléphone valide.'; form.elements.tel.classList.add('invalid'); }

    if (error) {
      errorBox.textContent = error;
      errorBox.classList.remove('hidden');
      (form.querySelector('.invalid') || form).focus();
      return;
    }
    errorBox.classList.add('hidden');

    const formule = form.querySelector('input[name="formule"]:checked').value;
    const lines = [
      'Bonjour MAKAHO Academy 👋',
      'Je souhaite m\'inscrire à la Session 1 (TikTok, monétisation, création de contenu & IA).',
      '',
      `👤 Nom : ${nom}`,
      `📞 Téléphone : ${tel}`,
      `📍 Ville : ${val('ville') || 'Non précisée'}`,
      `🎟️ Formule : ${formule}`,
      `💳 Paiement : ${val('paiement')}`,
    ];
    if (val('message')) lines.push('', `💬 Message : ${val('message')}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });

  // Mentions légales
  const modal = $('#legal-modal');
  const toggleModal = (open) => {
    modal.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('#legal-close').focus(); else $('#legal-btn').focus();
  };
  $('#legal-btn').addEventListener('click', () => toggleModal(true));
  $('#legal-close').addEventListener('click', () => toggleModal(false));
  modal.addEventListener('click', (e) => { if (e.target === modal) toggleModal(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) toggleModal(false); });
})();
