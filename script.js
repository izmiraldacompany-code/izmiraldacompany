"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const navbarCollapse = document.getElementById("primaryNavigation");
  const navLinks = navbarCollapse?.querySelectorAll("a.nav-link, a.btn") ?? [];

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  const galleryModal = document.getElementById("galleryModal");
  galleryModal?.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const modalImage = document.getElementById("galleryModalImage");
    const modalCaption = document.getElementById("galleryModalCaption");

    if (!(trigger instanceof HTMLElement) || !(modalImage instanceof HTMLImageElement)) return;

    modalImage.src = trigger.dataset.gallerySrc ?? "";
    modalImage.alt = trigger.dataset.galleryAlt ?? "Imagen del trabajo en Gaza";
    if (modalCaption) modalCaption.textContent = trigger.dataset.galleryCaption ?? "";
  });

  const projectVideo = document.getElementById("projectVideo");
  const videoPlayCover = document.getElementById("videoPlayCover");

  if (projectVideo instanceof HTMLVideoElement && videoPlayCover instanceof HTMLButtonElement) {
    videoPlayCover.addEventListener("click", async () => {
      try {
        await projectVideo.play();
        videoPlayCover.hidden = true;
      } catch {
        videoPlayCover.setAttribute("aria-label", "No fue posible iniciar el video. Usa los controles de reproducción.");
      }
    });

    projectVideo.addEventListener("play", () => { videoPlayCover.hidden = true; });
    projectVideo.addEventListener("ended", () => {
      projectVideo.load();
      videoPlayCover.hidden = false;
    });
  }

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
      text: "Conoce las innovaciones solares que están llevando agua y energía a familias en Gaza.",
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
});
