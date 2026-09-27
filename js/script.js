console.log('Portafolio de Jeshua Useche inicializado');

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  reveal();
});

/**
 * 1. Listener de scroll para compactar la barra de navegación fija (> 40px)
 */
function initNavbarScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 2. Toggle del Menú Mobile con panel .glass y accesibilidad
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconBars = document.getElementById('menu-icon-bars');
  const iconClose = document.getElementById('menu-icon-close');
  const nav = document.getElementById('main-nav');

  if (!menuBtn || !mobileMenu) return;

  const closeMenu = () => {
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      iconBars?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
    }
  };

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    iconBars?.classList.toggle('hidden');
    iconClose?.classList.toggle('hidden');
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Cerrar al hacer clic fuera del menú o de la barra
  document.addEventListener('click', (e) => {
    if (!nav?.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Exponer función de cierre para uso en clics de enlace
  window.closeMobileMenu = closeMenu;
}

/**
 * 3. Smooth scroll para enlaces internos con compensación de la nav fija
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const nav = document.getElementById('main-nav');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        if (typeof window.closeMobileMenu === 'function') {
          window.closeMobileMenu();
        }

        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });
}

/**
 * 4. Función reveal() reutilizable con IntersectionObserver (fade + slide-up)
 * Observa elementos con clase .reveal y activa .revealed al entrar en viewport
 */
function reveal() {
  const targets = document.querySelectorAll('.reveal:not(.revealed)');
  if (!targets.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  targets.forEach((el) => observer.observe(el));
}
