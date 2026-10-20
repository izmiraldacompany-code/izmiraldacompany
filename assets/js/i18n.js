(() => {
  'use strict';

  const script = document.currentScript;
  const sourceUrl = new URL('../i18n/translations.json', script.src);
  const supported = ['es', 'en', 'ar'];
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  const saved = localStorage.getItem('izmiralda-language');
  const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
  const language = supported.includes(requested) ? requested :
    supported.includes(saved) ? saved : supported.includes(browser) ? browser : 'es';
  const translatableAttributes = ['alt', 'aria-label', 'title', 'placeholder', 'data-caption'];
  let dictionary = {};

  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const translate = value => dictionary[normalize(value)] || value;

  function preserveLanguageInLink(link) {
    if (language === 'es' || !link.href) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
    url.searchParams.set('lang', language);
    link.href = url.href;
  }

  function translateTextNode(node) {
    const source = normalize(node.nodeValue || '');
    if (!source || !dictionary[source]) return;
    const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
    const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${dictionary[source]}${trailing}`;
  }

  function translateElement(element) {
    if (element.matches?.('a')) preserveLanguageInLink(element);
    const localizedSource = element.getAttribute?.(`data-src-${language}`);
    if (localizedSource) element.setAttribute('src', localizedSource);
    translatableAttributes.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      const source = element.getAttribute(attribute);
      const translated = translate(source);
      if (translated !== source) element.setAttribute(attribute, translated);
    });
    [...element.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else if (node.nodeType === Node.ELEMENT_NODE && !node.matches('script, style')) translateElement(node);
    });
  }

  function addLanguageSelector(labels) {
    const nav = document.querySelector('[data-company-menu] .navbar-nav');
    if (!nav || nav.querySelector('[data-language-selector]')) return;
    const languageNames = {es: 'Español', en: 'English', ar: 'العربية'};
    const item = document.createElement('li');
    item.className = 'nav-item dropdown language-selector ms-lg-1';
    item.dataset.languageSelector = '';
    item.innerHTML = `<button class="nav-link dropdown-toggle" id="languageMenu" type="button"
        data-bs-toggle="dropdown" aria-expanded="false" aria-label="${labels.selector}">
        ${languageNames[language]}
      </button>
      <ul class="dropdown-menu" aria-labelledby="languageMenu">
        ${supported.map(code => `<li><button type="button" class="dropdown-item${code === language ? ' active' : ''}"
          data-language="${code}"${code === language ? ' aria-current="true"' : ''}>${languageNames[code]}</button></li>`).join('')}
      </ul>`;
    const donation = nav.querySelector('.nav-item:last-child');
    nav.insertBefore(item, donation);
    item.addEventListener('click', event => {
      const option = event.target.closest('[data-language]');
      if (!option || option.dataset.language === language) return;
      localStorage.setItem('izmiralda-language', option.dataset.language);
      const url = new URL(location.href);
      url.searchParams.set('lang', option.dataset.language);
      location.href = url.href;
    });
  }

  async function initialize() {
    try {
      const response = await fetch(sourceUrl, {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      dictionary = data.translations?.[language] || {};
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('izmiralda-language', language);
      addLanguageSelector(data.interface?.[language] || data.interface.es);
      if (language !== 'es') translateElement(document.documentElement);
      const observer = new MutationObserver(records => {
        if (language === 'es') return;
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
        }));
      });
      observer.observe(document.body, {childList: true, subtree: true});
      document.dispatchEvent(new CustomEvent('izmiralda:language-ready', {detail: {language}}));
    } catch (error) {
      console.error('No fue posible cargar las traducciones.', error);
      addLanguageSelector({selector: 'Seleccionar idioma'});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
