// Fuente única de la forma de los diagnósticos y de la metadata por categoría
// (criterio WCAG + guía de corrección). La consumen el panel y el reporte.

export type Finding = {
  message: string;
  location: string;
};

export type Diagnostics = {
  contrast: Finding[];
  images: Finding[];
  forms: Finding[];
};

export type CategoryKey = keyof Diagnostics;

export const CATEGORY_META: Record<
  CategoryKey,
  { title: string; wcag: string; fix: string }
> = {
  contrast: {
    title: "Contraste",
    wcag: "WCAG 1.4.3",
    fix: 'El texto no alcanza el contraste mínimo. Sube el ratio a 4.5:1 (texto normal) o 3:1 (texto grande), aclarando el fondo u oscureciendo el texto. WCAG 1.4.3.',
  },
  images: {
    title: "Imágenes sin ALT",
    wcag: "WCAG 1.1.1",
    fix: 'Agrega un atributo alt que describa la imagen; si es decorativa, usa alt vacío (alt=""). WCAG 1.1.1.',
  },
  forms: {
    title: "Formularios",
    wcag: "WCAG 3.3.2 y 1.3.1",
    fix: 'Asocia una etiqueta al campo con <label for="id"> o un aria-label. WCAG 3.3.2 y 1.3.1.',
  },
};
