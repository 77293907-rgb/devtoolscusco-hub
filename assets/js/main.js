/* main.js · Se completa en el Paso 5 (menú móvil, scroll suave, efectos hover). */
/* =========================================================
   devToolsCusco — main.js (FINAL)
   Módulos:
     1. Menú móvil con transición
     2. Header inteligente (oculta al bajar, aparece al subir)
     3. Sombra del header al hacer scroll
     4. Año dinámico en footer
     5. Contadores animados (sección Impacto)
     6. Reveal on scroll (IntersectionObserver)
     7. Tarjetas con tilt + cursor spotlight
     8. Back-to-top flotante
     9. Scroll suave con compensación de navbar + active link
   Todo respeta `prefers-reduced-motion`.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. MENÚ MÓVIL con transición
     ========================================================= */
  const toggleBtn  = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen   = document.getElementById('icon-open');
  const iconClose  = document.getElementById('icon-close');

  if (toggleBtn && mobileMenu) {
    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      // Fuerza un reflow para que la transición se dispare
      void mobileMenu.offsetHeight;
      mobileMenu.classList.add('is-open');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Cerrar menú');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Abrir menú');

      // Espera a que termine la transición antes de display:none
      const onEnd = (e) => {
        if (e.propertyName === 'max-height') {
          mobileMenu.classList.add('hidden');
          mobileMenu.removeEventListener('transitionend', onEnd);
        }
      };
      mobileMenu.addEventListener('transitionend', onEnd);
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Cierra menú si se redimensiona a desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* =========================================================
     2 + 3. HEADER INTELIGENTE + SOMBRA
     ========================================================= */
  const header = document.getElementById('site-header');
  if (header) {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      // Sombra suave tras 8px
      header.classList.toggle('is-scrolled', y > 8);

      // Ocultar al bajar (pasado 200px), mostrar al subir
      if (y > lastScrollY && y > 200) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }

      lastScrollY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =========================================================
     4. AÑO DINÁMICO
     ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
    /* =========================================================
     5. CONTADORES ANIMADOS
     ========================================================= */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target   = parseInt(el.dataset.count, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1600;
      const start    = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };

    if (prefersReduced) {
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* =========================================================
     6. REVEAL ON SCROLL
     ========================================================= */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* =========================================================
     7. TILT 3D + CURSOR SPOTLIGHT
     ========================================================= */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (tiltCards.length && !prefersReduced && window.matchMedia('(hover: hover)').matches) {
    const MAX_TILT = 6; // grados

    tiltCards.forEach((card) => {
      let rafId = null;

      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normaliza a -0.5 ... 0.5
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform =
            `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg)`;
          card.style.setProperty('--mx', `${x}px`);
          card.style.setProperty('--my', `${y}px`);
        });
      };

      const handleEnter = () => card.classList.add('is-hovered');
      const handleLeave = () => {
        card.classList.remove('is-hovered');
        card.style.transform = '';
        if (rafId) cancelAnimationFrame(rafId);
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseenter', handleEnter);
      card.addEventListener('mouseleave', handleLeave);
    });
  }
    /* =========================================================
     8. BACK TO TOP
     ========================================================= */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    });
  }

  /* =========================================================
     9. SCROLL SUAVE + COMPENSACIÓN NAVBAR + ACTIVE LINK
     ========================================================= */
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navbarHeight = header ? header.offsetHeight : 0;

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') return;

    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  // Active link (subrayado dinámico en nav desktop)
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionMap = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#') || id === '#') return;
      const section = document.querySelector(id);
      if (section) {
        if (!sectionMap.has(section)) sectionMap.set(section, []);
        sectionMap.get(section).push(link);
      }
    });

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const links = sectionMap.get(entry.target);
          if (!links) return;
          links.forEach((link) => {
            if (entry.isIntersecting) {
              link.classList.add('text-brand-700', 'font-semibold');
            } else {
              link.classList.remove('text-brand-700', 'font-semibold');
            }
          });
        });
      },
      { rootMargin: `-${navbarHeight + 20}px 0px -60% 0px`, threshold: 0 }
    );

    sectionMap.forEach((_, section) => activeObserver.observe(section));
  }

}); // ← cierre del DOMContentLoaded