# Convenciones de Izmiralda Company

- Todas las páginas, incluidas PGE, donaciones y respaldos, deben usar Bootstrap 5 para la estructura y adaptación responsive.
- Usar `container`, `row`, `col-*`, `row-cols-*` y gutters de Bootstrap para la grilla. Usar sus utilidades para espaciado, alineación y distribución interna.
- No reemplazar la grilla Bootstrap con CSS Grid, anchos de columnas propios o media queries equivalentes a sus utilidades.
- Añadir CSS personalizado únicamente cuando Bootstrap no resuelva el detalle requerido (identidad visual, ilustraciones, animaciones o controles específicos).
- Mantener estas reglas también en el HTML generado por los componentes JavaScript compartidos.

- Toda sección con título debe incluir una bajada explicativa después del título y de su separador decorativo, antes del contenido principal. Conservar las bajadas existentes y completar las que falten. Usar el tamaño e interlineado general del sitio, sin `lead` para estas bajadas.

- Todos los títulos principales y de sección (h1/h2, excepto títulos de diálogos) llevan inmediatamente debajo la línea amarilla compartida `title-rule`, antes de su bajada. No duplicarla donde ya exista.

- Todo elemento interactivo o con efecto hover debe mostrar `cursor: pointer` al pasar el mouse. Usar la hoja compartida `assets/css/interaction.css` y respetar los controles deshabilitados.
