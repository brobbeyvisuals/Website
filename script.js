/* ---------- Sticky nav ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
burger.addEventListener('click', () => nav.classList.toggle('is-open'));
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('is-open'))
);

/* ---------- Filters ---------- */
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.grid__item');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    items.forEach(i => {
      const show = cat === 'all' || i.dataset.cat === cat;
      i.classList.toggle('is-hidden', !show);
    });
  });
});

/* ---------- Packages tabs ---------- */
const pkgTabs = document.querySelectorAll('.packages__tab');
const pkgPanels = document.querySelectorAll('.packages__panel');
pkgTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.pkgTab;
    pkgTabs.forEach(t => t.classList.toggle('is-active', t === tab));
    pkgPanels.forEach(p => p.classList.toggle('is-active', p.dataset.pkgPanel === target));
  });
});

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbMeta = document.getElementById('lbMeta');
const lbClose = lb.querySelector('.lightbox__close');
const lbPrev = lb.querySelector('.lightbox__nav--prev');
const lbNext = lb.querySelector('.lightbox__nav--next');
let lbIndex = 0;

const visibleItems = () => Array.from(items).filter(i => !i.classList.contains('is-hidden'));

const openLb = (i) => {
  const list = visibleItems();
  if (!list.length) return;
  lbIndex = ((i % list.length) + list.length) % list.length;
  const el = list[lbIndex];
  lbImg.src = el.dataset.full;
  lbImg.alt = el.dataset.title;
  lbTitle.textContent = el.dataset.title;
  lbMeta.textContent = el.dataset.meta;
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};
const closeLb = () => {
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

items.forEach((item, idx) => {
  item.addEventListener('click', () => {
    const list = visibleItems();
    const i = list.indexOf(item);
    openLb(i >= 0 ? i : 0);
  });
});
lbClose.addEventListener('click', closeLb);
lbPrev.addEventListener('click', () => openLb(lbIndex - 1));
lbNext.addEventListener('click', () => openLb(lbIndex + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
  if (e.key === 'ArrowRight') openLb(lbIndex + 1);
});

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll(
  '.section-head, .grid__item, .about__media, .about__copy, .service, .post, .quote blockquote, .contact__inner'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealTargets.forEach(el => io.observe(el));

/* ---------- Form ---------- */
const form = document.getElementById('form');
const formNote = document.getElementById('formNote');
const formBtn = form.querySelector('button[type="submit"]');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.action || !form.action.includes('formsubmit')) {
    formNote.hidden = false;
    form.reset();
    return;
  }
  const originalLabel = formBtn.textContent;
  formBtn.textContent = 'Sending…';
  formBtn.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      formNote.hidden = false;
      form.reset();
    } else {
      formNote.hidden = false;
      formNote.textContent = "Couldn't send right now — please email brobbeyvisuals@gmail.com directly.";
    }
  } catch (err) {
    formNote.hidden = false;
    formNote.textContent = "Couldn't send right now — please email brobbeyvisuals@gmail.com directly.";
  } finally {
    formBtn.textContent = originalLabel;
    formBtn.disabled = false;
  }
});
