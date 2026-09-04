/* P&P Colorismédia — Shared JS */

// Hamburger menu
const btn = document.getElementById('hamburger');
const drawer = document.getElementById('nav-drawer');
if (btn && drawer) {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  const closeDrawer = () => {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}

// Drawer accordion (mobile sub-menus)
document.querySelectorAll('.drawer-toggle-btn').forEach(toggleBtn => {
  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    const item = toggleBtn.closest('.drawer-item');
    const subId = toggleBtn.dataset.sub;
    const sub = document.getElementById(subId);
    item.classList.toggle('open');
    if (sub) sub.classList.toggle('open');
  });
});

// Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// Active nav highlight
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// Contact form → mailto (interim solution until a form backend is wired up)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const val = id => (document.getElementById(id)?.value || '').trim();
    const materialSelect = document.getElementById('contact-material');
    const materialLabel = (materialSelect && materialSelect.selectedOptions[0]?.text) || '';

    const name = val('contact-name');
    const company = val('contact-company');
    const email = val('contact-email');
    const phone = val('contact-phone');
    const qty = val('contact-qty');
    const desc = val('contact-desc');

    const isEn = document.documentElement.lang === 'en';

    const subject = isEn
      ? `Quote Request — ${name}${company ? ' (' + company + ')' : ''}`
      : `Demande de soumission — ${name}${company ? ' (' + company + ')' : ''}`;

    const bodyLines = isEn ? [
      `Name: ${name}`,
      company && `Company: ${company}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      `Material: ${materialLabel}`,
      qty && `Thickness / quantity: ${qty}`,
      '',
      'Project description:',
      desc,
      '',
      "Don't forget to attach your DXF, PDF, or AI files to this email before sending."
    ].filter(Boolean).join('\n') : [
      `Nom : ${name}`,
      company && `Entreprise : ${company}`,
      `Courriel : ${email}`,
      phone && `Téléphone : ${phone}`,
      `Matériau : ${materialLabel}`,
      qty && `Épaisseur / quantité : ${qty}`,
      '',
      'Description du projet :',
      desc,
      '',
      "N'oubliez pas de joindre vos fichiers DXF, PDF ou AI à ce courriel avant de l'envoyer."
    ].filter(Boolean).join('\n');

    window.location.href = `mailto:petp@bellnet.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
  });
}

// Page transitions
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (
    a.target === '_blank' ||
    !href ||
    href.startsWith('#') ||
    href.startsWith('http') ||
    href.startsWith('mailto') ||
    href.startsWith('tel')
  ) return;
  a.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location = href; }, 260);
  });
});
