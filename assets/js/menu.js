/** Menú único de Izmiralda Company. Cargar inmediatamente después de data-company-menu.
 * Las URLs parten de este script para admitir subcarpetas y GitHub Pages.
 */
(() => {
  'use strict';
  const host = document.querySelector('[data-company-menu]');
  if (!host) return;
  const base = new URL('../../', document.currentScript.src).href;
  const isHome = location.pathname.replace(/index\.html$/, '') === new URL(base).pathname;
  const donationLabel = 'Apoya el proyecto';
  const home = isHome ? '' : base;
  const currentPage = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const pageSection = {
    'historia.html': '#historia',
    'nuestra_vision_y_mision.html': '#mision'
  }[currentPage];
  host.innerHTML = `<nav id="mainNavbar" class="navbar navbar-expand-lg navbar-dark  site-navbar" aria-label="Navegación principal">
    <div class="container">
      <a class="navbar-brand fw-bold letter-spacing" href="${home}#inicio" aria-label="Izmiralda, volver al inicio">IZMIRALDA COMPANY</a>
      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#primaryNavigation" aria-controls="primaryNavigation" aria-expanded="false" aria-label="Abrir navegación">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="primaryNavigation" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item"><a class="nav-link" href="${home}#inicio">Inicio</a></li>
          <li class="nav-item"><a class="nav-link" href="${home}#sobre-nosotros">Nosotros</a></li>
          <li class="nav-item"><a class="nav-link" href="${home}#mision">Misión visión</a></li>
          <li class="nav-item"><a class="nav-link" href="${home}#historia">Historia</a></li>
          <li class="nav-item dropdown">
            <button class="nav-link dropdown-toggle" id="projectsMenu" type="button" data-bs-toggle="dropdown" aria-expanded="false">Proyectos</button>
            <ul class="dropdown-menu" aria-labelledby="projectsMenu">
              <li><a class="dropdown-item" href="${home}#innovaciones">Proyectos & Soluciones</a></li>
              <li><a class="dropdown-item" href="${base}ECONOMIA_CIRCULAR/">Economía circular</a></li>
              <li><a class="dropdown-item" href="${base}PGE/">PGE · Destilador solar</a></li>
              <li><a class="dropdown-item" href="${base}PGC/">PGC · Cocina solar</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="${home}#nuestro-impacto">Nuestro impacto</a></li>
          <li class="nav-item"><a class="nav-link" href="${home}#galeria">Medios</a></li>
          <li class="nav-item"><a class="nav-link" href="#contacto">Contacto</a></li>
          <li class="nav-item ms-lg-2"><a class="btn btn-warning rounded-pill px-4 fw-bold" href="${base}donaciones.html">${donationLabel}</a></li>
        </ul>
      </div>
    </div>
  </nav>`;
  host.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    const collapse = host.querySelector('.navbar-collapse');
    if (window.bootstrap && collapse.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(collapse, {toggle:false}).hide();
    }
  });

  function initActiveNavigation() {
    // Un solo controlador del estado activo; Bootstrap ScrollSpy compite con este menú.
    window.bootstrap?.ScrollSpy.getInstance(document.body)?.dispose();
    document.body.removeAttribute('data-bs-spy');
    const links = [...host.querySelectorAll('a.nav-link, a.dropdown-item, a.btn')];
    const normalizePath = path => path.replace(/index\.html$/, '').replace(/\/$/, '');
    const currentPath = normalizePath(location.pathname);
    const sections = [];
    let pageLink = null;
    links.forEach(link => {
      const url = new URL(link.href);
      if (normalizePath(url.pathname) !== currentPath) return;
      if (!url.hash) pageLink = link;
      else {
        const section = document.getElementById(url.hash.slice(1));
        if (section) sections.push({ link, section });
      }
    });
    // Las páginas interiores conservan su sección del menú aunque el enlace vaya al inicio.
    if (pageSection) {
      pageLink = links.find(link => new URL(link.href).hash === pageSection) || pageLink;
    }
    // El orden de las secciones puede diferir del orden del menú.
    sections.sort((a, b) => a.section === b.section ? 0 :
      (a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    let pending = false;

    function updateActiveLink() {
      pending = false;
      const marker = Math.max(host.getBoundingClientRect().height,
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 32;
      let active = pageLink;
      sections.forEach(({ link, section }) => {
        const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        if (section.getBoundingClientRect().top <= marker + margin) active = link;
      });
      const footer = sections.find(({ section }) => section.id === 'contacto');
      if (footer && footer.section.getBoundingClientRect().top < window.innerHeight &&
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        active = footer.link;
      }
      if (!active && isHome) active = sections[0]?.link;
      links.forEach(link => {
        link.classList.toggle('active', link === active);
        if (link === active) link.setAttribute('aria-current', link === pageLink ? 'page' : 'location');
        else link.removeAttribute('aria-current');
      });
      host.querySelector('#projectsMenu').classList.toggle('active',
        Boolean(active?.closest('.dropdown')));
    }
    const scheduleUpdate = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(updateActiveLink);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    updateActiveLink();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initActiveNavigation);
  else initActiveNavigation();
})();
