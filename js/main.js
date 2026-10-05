/**
 * CHURN LANDING PAGE - VANILLA JAVASCRIPT
 * Handles:
 * 1. Responsive canvas viewport scaling (1512x5819)
 * 2. Smooth scrolling navigation bar
 * 3. Product carousel with crossfade transitions and 2D sliding indicator
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. RESPONSIVE CANVAS SCALING
  // =========================================================================
  const DESIGN_WIDTH = 1512;
  const DESIGN_HEIGHT = 5819;
  // Debe coincidir con el breakpoint de css/style.css (sección 11)
  const mobileQuery = window.matchMedia('(max-width: 900px)');

  function updateCanvasScale() {
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const canvas = document.getElementById('canvas');
    if (!canvasWrapper || !canvas) return;

    // Mobile/tablet: layout fluido, sin escalado
    if (mobileQuery.matches) {
      canvasWrapper.style.height = '';
      canvas.style.transform = '';
      return;
    }

    const scale = window.innerWidth / DESIGN_WIDTH;
    canvasWrapper.style.height = (DESIGN_HEIGHT * scale) + 'px';
    canvas.style.transform = 'scale(' + scale + ')';
  }

  window.addEventListener('resize', updateCanvasScale);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCanvasScale);
  } else {
    updateCanvasScale();
  }

  // =========================================================================
  // 2. SMOOTH SCROLLING NAVIGATION
  // =========================================================================
  const SCROLL_TARGETS = {
    'Home': 0,
    'hero': 0,
    'Sobre Nosotros': 974,
    'sobre-nosotros': 974,
    'Productos': 1943,
    'productos': 1943,
    'Mayoristas': 2912,
    'mayorista': 2912,
    'Galeria': 3902,
    'galeria': 3902,
    'Donde estamos': 4850,
    'donde-estamos': 4850
  };

  const SECTION_IDS = {
    'Home': 'hero',
    'hero': 'hero',
    'Sobre Nosotros': 'sobre-nosotros',
    'sobre-nosotros': 'sobre-nosotros',
    'Productos': 'productos',
    'productos': 'productos',
    'Mayoristas': 'mayorista',
    'mayorista': 'mayorista',
    'Galeria': 'galeria',
    'galeria': 'galeria',
    'Donde estamos': 'donde-estamos',
    'donde-estamos': 'donde-estamos'
  };

  function performScroll(top) {
    var validTop = Math.max(0, Math.round(top));
    try {
      window.scrollTo({ top: validTop, behavior: 'smooth' });
    } catch (e) {}
    try {
      if (document.documentElement && document.documentElement.scrollTop !== validTop) {
        document.documentElement.scrollTo({ top: validTop, behavior: 'smooth' });
      }
    } catch (e) {}
    try {
      if (document.body && document.body.scrollTop !== validTop) {
        document.body.scrollTo({ top: validTop, behavior: 'smooth' });
      }
    } catch (e) {}
  }

  function scrollToSection(targetName) {
    if (!targetName) return;
    var cleanTarget = targetName.replace(/^#/, '');

    // Buscar clave normalizada (case-insensitive)
    var matchedKey = null;
    for (var key in SECTION_IDS) {
      if (key.toLowerCase() === cleanTarget.toLowerCase() ||
          SECTION_IDS[key].toLowerCase() === cleanTarget.toLowerCase()) {
        matchedKey = key;
        break;
      }
    }

    var sectionId = matchedKey ? SECTION_IDS[matchedKey] : cleanTarget;

    // Mobile: layout fluido, calculamos posición en el documento
    if (mobileQuery.matches) {
      var section = document.getElementById(sectionId);
      if (section) {
        var currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var top = (sectionId === 'hero') ? 0 : section.getBoundingClientRect().top + currentScroll - 74;
        performScroll(top);
      }
      return;
    }

    // Desktop: lienzo escalado proporcional a DESIGN_WIDTH (1512)
    var targetY = matchedKey ? SCROLL_TARGETS[matchedKey] : null;
    if (typeof targetY !== 'number') {
      var el = document.getElementById(sectionId);
      if (el) {
        targetY = el.offsetTop;
      }
    }

    if (typeof targetY === 'number') {
      var scale = window.innerWidth / DESIGN_WIDTH;
      var headerOffset = (targetY > 0) ? (74 * scale) : 0;
      performScroll(Math.max(0, (targetY * scale) - headerOffset));
    }
  }

  // Menú hamburguesa (solo visible en mobile)
  function setMenu(open) {
    var header = document.getElementById('main-header');
    var toggle = document.getElementById('boton-menu') || document.getElementById('menu-toggle');
    if (!header || !toggle) return;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  function initNav() {
    document.querySelectorAll('[data-nav-target], .header-nav a').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var navTarget = btn.getAttribute('data-nav-target');
        var href = btn.getAttribute('href');

        // Si es un enlace externo o protocolo (whatsapp, http, etc.), no interceptar
        if (href && /^(https?:|\/\/|mailto:|tel:)/i.test(href)) {
          setMenu(false);
          return;
        }

        var target = navTarget || (href && href.startsWith('#') ? href.slice(1) : href);
        if (target) {
          e.preventDefault();
          setMenu(false);
          scrollToSection(target);
        }
      });
    });

    var headerCta = document.querySelector('.header-cta');
    if (headerCta) {
      headerCta.addEventListener('click', function () {
        setMenu(false);
      });
    }

    var toggle = document.getElementById('boton-menu') || document.getElementById('menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      });
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#main-header')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    mobileQuery.addEventListener('change', function () { setMenu(false); });

    // Marquesina de partners: duplicamos los logos para un loop infinito continuo (desktop y mobile)
    var partners = document.querySelector('.lista-mayoristas, .partners-list');
    if (partners && !partners.dataset.cloned) {
      partners.dataset.cloned = 'true';
      Array.prototype.slice.call(partners.children).forEach(function (logo) {
        var clone = logo.cloneNode(true);
        clone.classList.add('clon-mayorista', 'partner-clone');
        clone.setAttribute('aria-hidden', 'true');
        partners.appendChild(clone);
      });
    }

    // Animación de aparición al hacer scroll (solo mobile)
    if (mobileQuery.matches && 'IntersectionObserver' in window) {
      var revealEls = document.querySelectorAll(
        '.about-title, .about-description, .chef-card, #productos .products-title, ' +
        '.wholesale-title, .wholesale-subtitle, .wholesale-description, .wholesale-cta-btn, ' +
        '.gallery-title, .gallery-item, .location-section-title, .map-card, .location-details'
      );
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

  // =========================================================================
  // 3. PRODUCT CAROUSEL (EXACT ORIGINAL FUNCTIONALITY)
  // =========================================================================
  const PRODUCT_COUNT = 7;

  var currentIndex = 0;

  function selectProduct(index) {
    if (index < 0 || index >= PRODUCT_COUNT) return;
    currentIndex = index;

    // 1. Update titles crossfade
    var titles = document.querySelectorAll('.titulos-productos [data-title-index], #product-titles [data-title-index]');
    titles.forEach(function (title) {
      var idx = parseInt(title.getAttribute('data-title-index'), 10);
      if (idx === index) {
        title.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
        title.classList.add('opacity-100', 'translate-y-0');
      } else {
        title.classList.remove('opacity-100', 'translate-y-0');
        title.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
      }
    });

    // 2. Update showcase items crossfade
    var showcaseItems = document.querySelectorAll('.item-escaparate, .escaparate-producto [data-showcase-index], #product-showcase [data-showcase-index]');
    showcaseItems.forEach(function (item) {
      var idx = parseInt(item.getAttribute('data-showcase-index'), 10);
      if (idx === index) {
        item.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        item.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
      } else {
        item.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        item.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      }
    });

    // 3. Carrusel de miniaturas (desktop): centrar la miniatura activa en la tira
    var strip = document.getElementById('thumbs-strip');
    var activeThumb = strip && strip.querySelector('[data-thumb-index="' + index + '"]');
    if (activeThumb) {
      strip.scrollTo({
        left: activeThumb.offsetLeft - (strip.clientWidth - activeThumb.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }

    // 4. Estado activo de miniaturas (usado por el layout mobile/desktop)
    document.querySelectorAll('[data-thumb-index]').forEach(function (btn) {
      var isActive = parseInt(btn.getAttribute('data-thumb-index'), 10) === index;
      btn.classList.toggle('is-active', isActive);
      btn.classList.toggle('activo', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // 5. Estado activo de dots en carrusel mobile
    document.querySelectorAll('.puntos-carrusel .punto-carrusel, #product-dots .product-dot').forEach(function (dot) {
      var idx = parseInt(dot.getAttribute('data-dot-index'), 10);
      dot.classList.toggle('is-active', idx === index);
      dot.classList.toggle('activo', idx === index);
    });
  }

  function nextProduct() {
    selectProduct((currentIndex + 1) % PRODUCT_COUNT);
  }

  function prevProduct() {
    selectProduct((currentIndex - 1 + PRODUCT_COUNT) % PRODUCT_COUNT);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Miniaturas desktop (click)
    document.querySelectorAll('[data-thumb-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-thumb-index'), 10);
        selectProduct(idx);
      });
    });

    // Flechas del carrusel mobile
    var prevBtn = document.getElementById('product-prev-btn') || document.querySelector('.flecha-anterior');
    if (prevBtn) prevBtn.addEventListener('click', prevProduct);

    var nextBtn = document.getElementById('product-next-btn') || document.querySelector('.flecha-siguiente');
    if (nextBtn) nextBtn.addEventListener('click', nextProduct);

    // Flechas del carrusel de miniaturas (desktop)
    var thumbsPrev = document.getElementById('thumbs-prev');
    if (thumbsPrev) thumbsPrev.addEventListener('click', prevProduct);
    var thumbsNext = document.getElementById('thumbs-next');
    if (thumbsNext) thumbsNext.addEventListener('click', nextProduct);

    // Dots del carrusel mobile
    document.querySelectorAll('.puntos-carrusel .punto-carrusel, #product-dots .product-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-dot-index'), 10);
        selectProduct(idx);
      });
    });

    // Gesto de deslizamiento táctil (Swipe) para mobile
    var productSection = document.getElementById('productos');
    if (productSection) {
      var touchStartX = 0;
      var touchStartY = 0;
      var isSwiping = false;

      productSection.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isSwiping = true;
        }
      }, { passive: true });

      productSection.addEventListener('touchend', function (e) {
        if (!isSwiping || e.changedTouches.length === 0) return;
        isSwiping = false;
        var diffX = e.changedTouches[0].clientX - touchStartX;
        var diffY = e.changedTouches[0].clientY - touchStartY;

        // Si el gesto fue horizontal y con al menos 35px de desplazamiento
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
          if (diffX < 0) {
            nextProduct(); // Deslizó hacia la izquierda -> siguiente
          } else {
            prevProduct(); // Deslizó hacia la derecha -> anterior
          }
        }
      }, { passive: true });

      // Soporte de arrastre con mouse para desktop/emulador en vista mobile
      var mouseStartX = 0;
      var isMouseDown = false;
      productSection.addEventListener('mousedown', function (e) {
        if (mobileQuery.matches) {
          isMouseDown = true;
          mouseStartX = e.clientX;
        }
      });

      window.addEventListener('mouseup', function (e) {
        if (!isMouseDown) return;
        isMouseDown = false;
        var diffX = e.clientX - mouseStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) {
            nextProduct();
          } else {
            prevProduct();
          }
        }
      });
    }

    // Estado inicial: producto 0 seleccionado
    selectProduct(0);

    // =========================================================================
    // 4. ESTADO EN VIVO DEL LOCAL (ABIERTO / CERRADO)
    // - Viernes: 15:30 – 19:00
    // - Sábados: 09:00 – 12:30 y 15:30 – 19:00
    // - Domingos: 09:00 – 12:30 y 15:30 – 19:00
    // =========================================================================
    function updateStoreStatus() {
      var titleEl = document.getElementById('estado-titulo');
      var detailEl = document.getElementById('estado-detalle');
      var dotEl = document.getElementById('estado-punto');
      if (!titleEl || !detailEl || !dotEl) return;

      var now = new Date();
      var day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado
      var currentMin = now.getHours() * 60 + now.getMinutes();

      var schedule = {
        5: [ // Viernes
          { start: 15 * 60 + 30, end: 19 * 60, closeStr: '19:00', openStr: '15:30' }
        ],
        6: [ // Sábado
          { start: 9 * 60, end: 12 * 60 + 30, closeStr: '12:30', openStr: '09:00' },
          { start: 15 * 60 + 30, end: 19 * 60, closeStr: '19:00', openStr: '15:30' }
        ],
        0: [ // Domingo
          { start: 9 * 60, end: 12 * 60 + 30, closeStr: '12:30', openStr: '09:00' },
          { start: 15 * 60 + 30, end: 19 * 60, closeStr: '19:00', openStr: '15:30' }
        ]
      };

      var todaySlots = schedule[day] || [];
      var isOpen = false;
      var title = 'CERRADO';
      var detail = '';

      // 1. ¿Está abierto en este momento?
      for (var i = 0; i < todaySlots.length; i++) {
        if (currentMin >= todaySlots[i].start && currentMin < todaySlots[i].end) {
          isOpen = true;
          title = 'ABIERTO';
          detail = '• Hasta las ' + todaySlots[i].closeStr + ' hs';
          break;
        }
      }

      // 2. Si hoy abre en una franja más tarde
      if (!isOpen) {
        for (var j = 0; j < todaySlots.length; j++) {
          if (currentMin < todaySlots[j].start) {
            title = 'CERRADO AHORA';
            detail = 'Abrimos hoy a las ' + todaySlots[j].openStr + ' hs';
            break;
          }
        }
      }

      // 3. Si ya cerró hoy o hoy no abre, buscar el próximo día
      if (!isOpen && !detail) {
        var dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        for (var offset = 1; offset <= 7; offset++) {
          var nextDay = (day + offset) % 7;
          var nextSlots = schedule[nextDay];
          if (nextSlots && nextSlots.length > 0) {
            var firstSlot = nextSlots[0];
            var dayText = offset === 1 ? 'mañana' : 'el ' + dayNames[nextDay];
            title = 'CERRADO AHORA';
            detail = 'Abrimos ' + dayText + ' ' + firstSlot.openStr + ' hs';
            break;
          }
        }
      }

      // Actualizar DOM
      titleEl.textContent = title;
      detailEl.textContent = detail;
      if (isOpen) {
        dotEl.classList.remove('cerrado');
        dotEl.classList.add('abierto');
      } else {
        dotEl.classList.remove('abierto');
        dotEl.classList.add('cerrado');
      }
    }

    updateStoreStatus();
    // Actualizar cada 60 segundos
    setInterval(updateStoreStatus, 60000);
  });

})();
