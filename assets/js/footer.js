/** Footer único de Izmiralda Company. Cargar después de data-company-footer.
 * Las imágenes se resuelven desde la raíz del proyecto, también en GitHub Pages.
 */
(() => {
  'use strict';
  const host = document.querySelector('[data-company-footer]');
  if (!host) return;
  host.id = 'contacto';
  const base = new URL('../../', document.currentScript.src).href;
  host.innerHTML = `
    <div class="container">
      <div class="footer-contact-layout row align-items-center g-4 py-3 text-center text-md-start">
        <div class="col-12 col-md-6">
          <h2 class="h4 text-white my-3">Contacto</h2>
          <div class="lh-1 mb-3"><span class="title-rule mt-0" aria-hidden="true"></span></div>
          <small class="footer-contact-text d-block">¿Quieres conocer más sobre nuestros proyectos, colaborar o resolver una duda? Comunícate con Izmiralda Company por correo electrónico o WhatsApp.</small>
        </div>
        <div class="col-12 col-md-6">
        <div class="footer-contact-links row g-4">
          <div class="col-12 col-sm-6">
            <span class="footer-contact-label d-block mb-1">Correo electrónico</span>
            <a href="mailto:Izmiraldacompany@gmail.com">Izmiraldacompany@gmail.com</a>
          </div>
          <div class="col-12 col-sm-6">
            <span class="footer-contact-label d-block mb-1">WhatsApp</span>
            <a href="https://wa.me/56964931110" target="_blank" rel="noopener noreferrer">+56 9 6493 1110</a>
          </div>
        </div>
      </div>
      </div>
      <hr class="border-light opacity-25 my-2">
      <div class="footer-bottom row align-items-center justify-content-between g-3">
        <div class="footer-brands col-12 col-md-auto d-flex flex-wrap align-items-center justify-content-center gap-3">
          <strong class="letter-spacing">IZMIRALDA</strong>
          <img class="footer-partner-logo" src="${base}assets/images/startup-chile-white.png" alt="Start-Up Chile" width="120" height="54" loading="lazy">
        </div>
        <p class="col-12 col-md mb-0 text-center text-md-end">© 2026 Izmiralda Company. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
})();
