# PGE Solar

Landing estático con HTML semántico, Bootstrap 5.3.8 y JavaScript. No necesita PHP ni compilación.

## Estructura y comportamiento

Toda la distribución usa Bootstrap: `container`, `row`, `col-*`, `row-cols-*`, gutters, utilidades de espaciado y flex, posiciones, proporciones `ratio`, tarjetas `card`, tablas responsive y pie de página. No hay media queries propias ni cuadrículas personalizadas.

Navegación: `navbar` y `Collapse`. Galería: `Carousel`, sin avance automático, con controles táctiles y de teclado. Fotos ampliadas: `Modal`, con cierre Escape, gestión de foco y bloqueo del fondo provistos por Bootstrap. ScrollSpy marca la sección activa. El JavaScript propio solo conecta el contenido de fotografías y los controles de reproducción del video.

`assets/css/style.css` define únicamente la identidad visual: colores, tipografía, bordes, fondos, desenfoque del panel e iconos. Las dimensiones específicas son las de recursos visuales (logo, SVG y límite de la foto ampliada).

Bootstrap CSS y bundle JS se cargan desde jsDelivr con SRI. La estructura requiere esos archivos oficiales. Todos los recursos del proyecto están dentro de assets.

## Publicación

Canonical, Open Graph, JSON-LD y sitemap apuntan a https://izmiraldacompany.com/PGE/. Actualizarlos si cambia la URL. Incorporar sitemap.xml al sitemap del dominio o enviarlo a Search Console. El botón de ficha técnica solicita el documento por correo; no se ha proporcionado un PDF.

## Validación

Revisión de escritorio y móvil: columnas Bootstrap sin desbordamiento horizontal, video y tarjetas con igual alto en escritorio, navegación colapsable, avance de galería y modal con Escape.

## Tamaños de texto

Editar las variables del bloque `:root` en `assets/css/style.css`. `--font-size-h1` a `--font-size-h6` controlan los encabezados generales; `--font-size-p` los párrafos y `--font-size-small` los textos pequeños. Las clases Bootstrap `.h1`–`.h6` y `.fs-1`–`.fs-6` comparten esas variables. Las tarjetas, navegación, botones, etiquetas, tablas y pie tienen variantes semánticas específicas para conservar su jerarquía visual. Todos los tamaños personalizados usan variables y la escala usa rem (con clamp en títulos fluidos).


## Menú compartido en GitHub Pages

La portada de Izmiralda Company y PGE usan `assets/js/menu.js` y `assets/css/menu.css`,
en la raíz del proyecto. Edita el menú únicamente en ese JavaScript.

Para incluirlo desde una página dentro de PGE:

```html
<link rel="stylesheet" href="../assets/css/menu.css">
<header class="sticky-top" data-company-menu></header>
<script src="../assets/js/menu.js"></script>
```

Carga Bootstrap CSS y su bundle JavaScript. Ajusta las rutas según la carpeta.
Los enlaces llevan a las secciones de Izmiralda Company desde cualquier página.
Publica también la carpeta assets en GitHub Pages. El menú requiere JavaScript.


## Interacciones compartidas

`assets/js/izmiralda-interacciones.js`, en la raíz del proyecto, controla ambas
páginas. PGE lo carga con `../assets/js/izmiralda-interacciones.js` después de
Bootstrap. Reutiliza el control de video y la actualización de fotos; los
componentes exclusivos se inicializan solo cuando existe su contenedor.
El antiguo `PGE/assets/js/main.js` fue integrado y eliminado.
