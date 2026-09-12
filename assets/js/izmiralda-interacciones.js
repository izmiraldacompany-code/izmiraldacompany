/** Interacciones compartidas de Izmiralda Company y PGE.
 * Bootstrap debe cargarse antes. Cada componente se activa solo si existe en el DOM.
 * Incluye videos, galerías, modales, donaciones, copiar datos y compartir.
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Reiniciar cada cifra al volver a entrar en pantalla.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const impactCounters = document.querySelectorAll('.impact-stat strong');
  if (impactCounters.length && !reducedMotion.matches && 'IntersectionObserver' in window) {
    const numberFormat = new Intl.NumberFormat('es-CL');
    const counterStates = new WeakMap();
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const counter = entry.target;
        const state = counterStates.get(counter);
        if (!entry.isIntersecting) {
          cancelAnimationFrame(state.frame);
          state.visible = false;
          counter.textContent = state.finalText;
          return;
        }
        if (state.visible || entry.intersectionRatio < 0.5) return;
        state.visible = true;
        const { finalText, target } = state;
        counter.setAttribute('aria-label', finalText.trim());
        counter.textContent = '+ 0';
        let start;
        const tick = (timestamp) => {
          start ??= timestamp;
          const progress = reducedMotion.matches ? 1 : Math.min((timestamp - start) / 1800, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = progress === 1 ? finalText : `+ ${numberFormat.format(Math.floor(target * eased))}`;
          if (progress < 1) state.frame = requestAnimationFrame(tick);
        };
        state.frame = requestAnimationFrame(tick);
      });
    }, { threshold: [0, 0.5] });
    impactCounters.forEach((counter) => {
      const finalText = counter.textContent;
      const target = Number(finalText.replace(/\D/g, ''));
      if (!Number.isFinite(target) || target <= 0) return;
      counterStates.set(counter, { finalText, target, frame: 0, visible: false });
      counterObserver.observe(counter);
    });
  }

  const navbarCollapse = document.getElementById("primaryNavigation");
  const navLinks = navbarCollapse?.querySelectorAll("a.nav-link, a.btn") ?? [];

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  /** Actualiza imagen y descripción sin insertar HTML procedente de atributos. */
  function setPhoto(image, caption, src, alt, description) {
    if (!(image instanceof HTMLImageElement)) return;
    image.src = src;
    image.alt = alt;
    if (caption) caption.textContent = description;
  }

  const galleryModal = document.getElementById("galleryModal");
  galleryModal?.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const modalImage = document.getElementById("galleryModalImage");
    const modalCaption = document.getElementById("galleryModalCaption");

    if (!(trigger instanceof HTMLElement) || !(modalImage instanceof HTMLImageElement)) return;

    setPhoto(modalImage, modalCaption, trigger.dataset.gallerySrc ?? '',
      trigger.dataset.galleryAlt ?? 'Imagen del trabajo en terreno', trigger.dataset.galleryCaption ?? '');
  });

  /** Inicializa una portada de video en cualquiera de las dos páginas.
   * Se omiten componentes ausentes. PGE adapta el encuadre durante la reproducción.
   */
  function initVideo(videoId, coverId, statusId, fitVideo = false) {
    const video = document.getElementById(videoId);
    const cover = document.getElementById(coverId);
    const status = document.getElementById(statusId);
    if (!(video instanceof HTMLVideoElement) || !cover) return;
    const hideCover = () => {
      cover.hidden = true;
      cover.classList.add('d-none');
      if (fitVideo) video.classList.replace('object-fit-cover', 'object-fit-contain');
    };
    const report = message => {
      if (status) status.textContent = message;
      else cover.setAttribute('aria-label', message);
    };
    const originalLabel = cover.getAttribute('aria-label');
    cover.addEventListener('click', async () => {
      if (fitVideo) { hideCover(); video.focus(); }
      try { await video.play(); hideCover(); }
      catch { report('No fue posible iniciar el video. Usa los controles de reproducción.'); }
    });
    video.addEventListener('play', () => {
      hideCover();
      if (status) status.textContent = '';
      if (originalLabel) cover.setAttribute('aria-label', originalLabel);
    });
    video.addEventListener('ended', () => {
      cover.hidden = false;
      cover.classList.remove('d-none');
      if (fitVideo) video.classList.replace('object-fit-contain', 'object-fit-cover');
      video.load();
    });
    video.addEventListener('error', () => {
      hideCover();
      report('No se pudo cargar el video. Vuelve a intentarlo.');
    });
  }
  initVideo('projectVideo', 'videoPlayCover', 'videoStatus');
  initVideo('project-video', 'video-cover', 'video-status', true);

  const donationForm = document.getElementById("donationForm");
  const donateButton = document.getElementById("donateButton");
  const donationHelp = document.getElementById("donationHelp");

  donationForm?.querySelectorAll('input[name="donationAmount"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (!(donateButton instanceof HTMLAnchorElement) || !(input instanceof HTMLInputElement)) return;
      const label = document.querySelector(`label[for="${input.id}"]`)?.textContent?.trim() ?? "el monto seleccionado";
      donateButton.href = input.value;
      donateButton.classList.remove("disabled");
      donateButton.setAttribute("aria-disabled", "false");
      donateButton.removeAttribute("tabindex");
      donateButton.textContent = `Donar ${label}`;
      if (donationHelp) donationHelp.textContent = "Serás dirigido a Mercado Pago para completar la contribución.";
    });
  });

  donationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = donationForm.querySelector('input[name="donationAmount"]:checked');

    if (!(selected instanceof HTMLInputElement)) {
      if (donationHelp) donationHelp.textContent = "Selecciona un monto antes de continuar.";
      return;
    }
    if (donateButton instanceof HTMLAnchorElement) donateButton.click();
  });

  donateButton?.addEventListener("click", (event) => {
    if (donateButton.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      if (donationHelp) donationHelp.textContent = "Selecciona un monto antes de continuar.";
    }
  });

  document.querySelectorAll(".copy-bank-data").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!(button instanceof HTMLButtonElement)) return;
      const content = (button.dataset.copy ?? "").replaceAll("\\n", "\n");
      const originalLabel = button.textContent;

      try {
        await navigator.clipboard.writeText(content);
        button.textContent = "Datos copiados";
      } catch {
        button.textContent = "No fue posible copiar";
      }

      window.setTimeout(() => { button.textContent = originalLabel; }, 2200);
    });
  });

  const shareButton = document.getElementById("shareStory");
  shareButton?.addEventListener("click", async () => {
    const shareData = {
      title: "Izmiralda — Enas Alghoul",
      text: location.pathname.endsWith('/donaciones.html')
        ? "Conoce las innovaciones solares que están llevando agua y energía a familias en Gaza."
        : "Conoce las innovaciones solares que están llevando agua y energía a las familias.",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        shareButton.textContent = "Enlace copiado";
        window.setTimeout(() => { shareButton.textContent = "Compartir historia"; }, 2200);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        shareButton.textContent = "No fue posible compartir";
        window.setTimeout(() => { shareButton.textContent = "Compartir historia"; }, 2200);
      }
    }
  });

  /** Mantiene visible la portada cuando un video se pausa o termina. */
  function initVideoCoverStates() {
    document.querySelectorAll('video[poster]').forEach(video => {
      const wrapper = video.parentElement;
      const cover = wrapper?.querySelector('.media-video-cover, #video-cover, #videoPlayCover');
      if (!wrapper || !cover) return;
      const icon = cover.querySelector('.media-video-play svg, .play-circle svg, .video-play-button svg');
      const playIcon = icon?.innerHTML;
      if (icon) icon.setAttribute('viewBox', '0 0 24 24');
      const label = cover.getAttribute('aria-label') || 'Reproducir video';
      const poster = document.createElement('img');
      poster.src = video.poster;
      poster.alt = '';
      poster.setAttribute('aria-hidden', 'true');
      poster.className = 'w-100 h-100 object-fit-cover d-none';
      poster.style.pointerEvents = 'none';
      wrapper.insertBefore(poster, cover);
      const show = ended => {
        poster.classList.remove('d-none');
        cover.hidden = false;
        cover.classList.remove('d-none');
        if (icon) icon.innerHTML = ended ? playIcon : '<path fill="currentColor" stroke="none" d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
        cover.setAttribute('aria-label', ended ? label : 'Reanudar video pausado');
        cover.dataset.playbackState = ended ? 'ended' : 'paused';
      };
      video.addEventListener('pause', () => { if (!video.error) show(video.ended); });
      video.addEventListener('ended', () => show(true));
      video.addEventListener('play', () => {
        poster.classList.add('d-none');
        cover.hidden = true;
        cover.classList.add('d-none');
        if (icon) icon.innerHTML = playIcon;
        cover.setAttribute('aria-label', label);
        cover.dataset.playbackState = 'playing';
      });
      video.addEventListener('error', () => poster.classList.add('d-none'));
    });
  }

  /** Coordina los videos del carrusel de medios y actualiza su contador. */
  function initMediaCarousel() {
    const carousel = document.getElementById('mediaCarousel');
    if (!carousel) return;
    const slideCount = carousel.querySelectorAll('.carousel-item').length;
    const videos = [...carousel.querySelectorAll('video')];
    carousel.querySelectorAll('.media-video').forEach(card => {
      const video = card.querySelector('video');
      const cover = card.querySelector('button');
      const status = card.parentElement?.querySelector('[role="status"]');
      if (!(video instanceof HTMLVideoElement) || !cover) return;
      cover.addEventListener('click', async () => {
        videos.forEach(other => { if (other !== video) other.pause(); });
        cover.classList.add('d-none');
        if (status) status.textContent = '';
        try { await video.play(); }
        catch {
          if (status) status.textContent = 'No fue posible iniciar el video. Usa los controles para reintentarlo.';
        }
      });
      video.addEventListener('play', () => {
        cover.classList.add('d-none');
        videos.forEach(other => { if (other !== video) other.pause(); });
      });
      video.addEventListener('ended', () => cover.classList.remove('d-none'));
      video.addEventListener('error', () => {
        cover.classList.add('d-none');
        if (status) status.textContent = 'No se pudo cargar el video. Vuelve a intentarlo.';
      });
    });
    carousel.addEventListener('slide.bs.carousel', () => videos.forEach(video => video.pause()));
    carousel.addEventListener('slid.bs.carousel', event => {
      const status = document.getElementById('mediaCarouselStatus');
      if (status) status.textContent = `${event.to + 1} / ${slideCount}`;
    });
    matchMedia('(min-width: 992px)').addEventListener('change', () => videos.forEach(video => video.pause()));
  }

  initVideoCoverStates();
  initMediaCarousel();

  // Componentes exclusivos de PGE: cada inicializador comprueba su contenedor.
  function initPgeGallery() {
  // 3. GALERÍA: páginas de 5 fotos en escritorio, 3 en tablet y 2 en móvil.
  const gallery = document.getElementById('project-gallery');
  if (!gallery || !window.bootstrap) return;
  const galleryInner = gallery.querySelector('.carousel-inner');
  // Conservar referencias a los botones originales antes de reorganizarlos.
  const galleryCards = [...galleryInner.querySelectorAll('[data-photo]')];
  const previous = gallery.querySelector('[data-bs-slide="prev"]');
  const next = gallery.querySelector('[data-bs-slide="next"]');
  // Usar los mismos puntos de corte lg y md de Bootstrap.
  const desktop = matchMedia('(min-width:992px)');
  const tablet = matchMedia('(min-width:768px)');
  // Recordar el tamaño actual para evitar reconstrucciones innecesarias.
  let perPage = 0;
  /** Actualiza el contador de páginas y desactiva las flechas en los extremos. */
  const updateGallery = () => {
    const slides = [...galleryInner.children];
    const index = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    document.getElementById('gallery-position').textContent = `${index + 1} / ${slides.length}`;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  };
  /**
   * Reagrupa los botones al cambiar de breakpoint. Conserva la página que
   * contiene la primera foto visible y mueve nodos, sin clonar imágenes.
   */
  const groupPhotos = () => {
    const size = desktop.matches ? 5 : tablet.matches ? 3 : 2;
    if (size === perPage) return;
    // Reubicar los mismos nodos: cada fotografía existe una sola vez.
    const current = galleryInner.querySelector('.carousel-item.active [data-photo]');
    const firstIndex = Math.max(0, galleryCards.indexOf(current));
    // Desmontar la instancia anterior antes de sustituir sus diapositivas.
    bootstrap.Carousel.getInstance(gallery)?.dispose();
    perPage = size;
    // Vaciar los contenedores; galleryCards mantiene las referencias a las fotos.
    galleryInner.replaceChildren();
    for (let start = 0; start < galleryCards.length; start += size) {
      const slide = document.createElement('div');
      // La división entera localiza la nueva página de la foto conservada.
      slide.className = 'carousel-item' + (Math.floor(firstIndex / size) === start / size ? ' active' : '');
      const row = document.createElement('div');
      row.className = 'row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3';
      galleryCards.slice(start, start + size).forEach(button => {
        const column = document.createElement('div');
        column.className = 'col';
        column.append(button);
        row.append(column);
      });
      slide.append(row);
      galleryInner.append(slide);
    }
    // Navegación manual con teclado y gestos; sin reproducción automática
    // ni salto de la última página a la primera.
    bootstrap.Carousel.getOrCreateInstance(gallery, {interval:false, ride:false, keyboard:true, touch:true, wrap:false});
    updateGallery();
  };
  // Construir al cargar y reagrupar solo al cruzar los puntos de corte.
  groupPhotos();
  desktop.addEventListener('change', groupPhotos);
  tablet.addEventListener('change', groupPhotos);
  // Actualizar el contador cuando Bootstrap termina la transición.
  gallery.addEventListener('slid.bs.carousel', updateGallery);

  }
  function initPgeModal() {
  // 4. MODAL: catálogo de fotos únicas por ruta. Map elimina entradas
  // repetidas y conserva el orden de la primera aparición de cada ruta.
  const photos = [...new Map([...document.querySelectorAll('[data-photo]')].map(el => [el.dataset.photo,{src:el.dataset.photo,caption:el.dataset.caption}])).values()];
  const modal = document.getElementById('photo-modal');
  // Índice de la foto abierta, comenzando en cero.
  if (!modal || !photos.length) return;
  let selected=0;
  /**
   * Muestra una foto, su descripción accesible y el contador.
   * El módulo permite recorrer circularmente el modal en ambas direcciones,
   * a diferencia del carrusel de miniaturas, que se detiene en los extremos.
   * @param {number} index Índice solicitado; admite -1 o photos.length.
   */
  const showPhoto = index => {
    selected=(index+photos.length)%photos.length;
    const photo=photos[selected];
    const img=document.getElementById('modal-image');
    setPhoto(img, document.getElementById('modal-caption'), photo.src, photo.caption, photo.caption);
    document.getElementById('photo-count').textContent=`${selected+1} / ${photos.length}`;
  };
  // relatedTarget es el botón que abrió el modal mediante data-bs-toggle.
  // Si no hay una ruta coincidente, mostrar la primera foto del catálogo.
  modal.addEventListener('show.bs.modal',event => {
    const src=event.relatedTarget?.dataset.photo;
    showPhoto(Math.max(0,photos.findIndex(photo => photo.src===src)));
  });
  document.getElementById('modal-prev').addEventListener('click',() => showPhoto(selected-1));
  document.getElementById('modal-next').addEventListener('click',() => showPhoto(selected+1));
  // Flechas del teclado dentro del modal. Evitar que desplacen la página.
  // Bootstrap gestiona Escape, el foco y el cierre del diálogo.
  modal.addEventListener('keydown',event => {
    if(event.key==='ArrowLeft') { event.preventDefault(); showPhoto(selected-1); }
    if(event.key==='ArrowRight') { event.preventDefault(); showPhoto(selected+1); }
  });
  }
  initPgeGallery();
  initPgeModal();
});
