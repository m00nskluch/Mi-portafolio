/**
 * Jeshua Useche — Portfolio Script v3
 * Apple Pro Edition
 *
 * Módulos:
 *  1. initLucide       — Renderiza iconos CDN
 *  2. initNavbar       — Pill compacto con clase .scrolled
 *  3. initMobileMenu   — Toggle accesible (Escape, click-fuera)
 *  4. initSmoothScroll — Offset de navbar + focus management
 *  5. initNavSpy       — IntersectionObserver aria-current
 *  6. initReveal       — Fade+slide en viewport, clase .in-view
 *  7. initSkillBars    — double-rAF para trigger de barras
 *  8. initFAQ          — Acordeón spring con max-height JS
 *  9. initContactForm  — Validación HTML5 + ARIA errors
 * 10. showToast        — Feedback flotante
 */

'use strict';

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initNavSpy();
  initReveal();
  initFAQ();
  initContactForm();
});

/* ── 1. LUCIDE ────────────────────────────────────────── */
function initLucide() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ── 2. NAVBAR ────────────────────────────────────────────
   Añade .scrolled cuando scrollY > 60 (rAF throttled)
   Responde en pointer-down para máxima sensación Apple
──────────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let raf = false;
  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    raf = false;
  };

  window.addEventListener('scroll', () => {
    if (!raf) { requestAnimationFrame(update); raf = true; }
  }, { passive: true });

  update();
}

/* ── 3. MOBILE MENU ───────────────────────────────────────
   Toggle accesible: Escape, clic-fuera, focus en primer link
──────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const nav  = btn?.closest('nav, header');
  if (!btn || !menu) return;

  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';

  const open = () => {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    // Respuesta inmediata + foco tras animación spring (~260ms)
    setTimeout(() => menu.querySelector('.mobile-link')?.focus(), 60);
  };

  const close = () => {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('pointerdown', e => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) { close(); btn.focus(); }
  });

  document.addEventListener('pointerdown', e => {
    if (isOpen() && nav && !nav.contains(e.target)) close();
  });

  menu.querySelectorAll('.mobile-link, .mobile-cta').forEach(el => {
    el.addEventListener('click', close);
  });

  window._closeMenu = close;
}

/* ── 4. SMOOTH SCROLL ─────────────────────────────────────
   Offset de navbar fija. Focus management WCAG 2.4.3
──────────────────────────────────────────────────────── */
function initSmoothScroll() {
  const nav = document.getElementById('main-nav');

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      window._closeMenu?.();

      const navH   = nav ? nav.getBoundingClientRect().height + 16 : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', id);

      // Mover foco al heading (screen reader WCAG 2.4.3)
      const heading = target.querySelector('[id$="-title"], h2, h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        setTimeout(() => heading.focus({ preventScroll: true }), 350);
      }
    });
  });
}

/* ── 5. NAV SPY ───────────────────────────────────────────
   Resalta enlace activo con aria-current="page"
──────────────────────────────────────────────────────── */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const dLinks   = document.querySelectorAll('.nav-link');
  const mLinks   = document.querySelectorAll('.mobile-link');
  if (!sections.length) return;

  const activate = id => {
    [dLinks, mLinks].forEach(group => {
      group.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', active);
        active
          ? link.setAttribute('aria-current', 'page')
          : link.removeAttribute('aria-current');
      });
    });
  };

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && activate(e.target.id)),
    { rootMargin: '-20% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(s => obs.observe(s));
  activate(sections[0].id);
}

/* ── 6. REVEAL ────────────────────────────────────────────
   Fade+slide al entrar al viewport. Clase .in-view
   Dispara también la animación de barras
──────────────────────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        animateBars(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -48px 0px', threshold: 0.07 }
  );

  items.forEach(el => obs.observe(el));
}

/* ── 7. SKILL BARS ────────────────────────────────────────
   Double requestAnimationFrame garantiza que la transición
   CSS se dispare DESPUÉS de que width empieza en 0
──────────────────────────────────────────────────────── */
function animateBars(container) {
  container.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.getAttribute('data-w') || '0%';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => { bar.style.width = target; })
    );
  });
}

/* ── 8. FAQ ACORDEÓN ──────────────────────────────────────
   Animación spring vía max-height dinámico (scrollHeight)
   Comportamiento acordeón: solo un item abierto a la vez
   Navegación por teclado: ArrowDown / ArrowUp
──────────────────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn   = item.querySelector('.faq-btn');
    const panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás (acordeón exclusivo)
      items.forEach(other => {
        if (other === item) return;
        const b = other.querySelector('.faq-btn');
        const p = other.querySelector('.faq-panel');
        if (b && p) collapse(b, p);
      });

      open ? collapse(btn, panel) : expand(btn, panel);
    });

    // Navegación por teclado entre items
    btn.addEventListener('keydown', e => {
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const triggers = [...document.querySelectorAll('.faq-btn')];
      const idx = triggers.indexOf(btn);
      const next = e.key === 'ArrowDown' ? triggers[idx + 1] : triggers[idx - 1];
      next?.focus();
    });
  });
}

function expand(btn, panel) {
  btn.setAttribute('aria-expanded', 'true');
  panel.style.maxHeight = `${panel.scrollHeight}px`;
  panel.classList.add('open');
}

function collapse(btn, panel) {
  btn.setAttribute('aria-expanded', 'false');
  panel.style.maxHeight = '0px';
  panel.classList.remove('open');
}

/* ── 9. FORMULARIO ────────────────────────────────────────
   Validación HTML5 + mensajes ARIA inline
   Envío nativo a FormSubmit (sin preventDefault si válido)
──────────────────────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const toast  = document.getElementById('toast');
  const submit = document.getElementById('contact-submit');
  if (!form) return;

  form.addEventListener('submit', e => {
    const f = {
      name:    form.querySelector('[name="name"]'),
      email:   form.querySelector('[name="email"]'),
      message: form.querySelector('[name="message"]'),
    };

    Object.values(f).forEach(clearErr);

    let valid = true;

    if (!f.name?.value.trim()) {
      setErr(f.name, 'Ingresa tu nombre completo.');
      valid = false;
    }
    if (!validEmail(f.email?.value.trim())) {
      setErr(f.email, 'Correo electrónico inválido.');
      valid = false;
    }
    if (!f.message?.value.trim()) {
      setErr(f.message, 'El mensaje no puede estar vacío.');
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    // Feedback visual antes de redirección FormSubmit
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Enviando…';
    }
    showToast(toast);
    // El form se envía nativamente al action
  });
}

/* ── 10. TOAST ────────────────────────────────────────────
   Animación spring de entrada + auto-hide a los 4.5s
──────────────────────────────────────────────────────── */
function showToast(toast) {
  if (!toast) return;
  toast.hidden = false;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => toast.classList.add('show'))
  );
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 500);
  }, 4500);
}

/* ── HELPERS ──────────────────────────────────────────── */
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

function setErr(input, msg) {
  if (!input) return;
  input.setAttribute('aria-invalid', 'true');
  const id  = `${input.id}-err`;
  let   el  = document.getElementById(id);
  if (!el) {
    el = document.createElement('p');
    el.id = id;
    el.setAttribute('role', 'alert');
    el.style.cssText = [
      'color:#ff453a',
      'font-size:0.75rem',
      'font-weight:500',
      'margin-top:4px',
      'letter-spacing:-0.01em',
    ].join(';');
    input.after(el);
  }
  el.textContent = msg;
  input.setAttribute('aria-describedby', id);
}

function clearErr(input) {
  if (!input) return;
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  document.getElementById(`${input.id}-err`)?.remove();
}
