// Nota: el chequeo de contraste ya NO vive aquí. Se movió a una medición real
// WCAG dentro de Puppeteer (ver utils/contrastCheck.ts), porque el contraste
// necesita los colores computados de la página renderizada, no el string HTML.

import type { Finding } from "../types";

// OJO (clave del estudio): los regex y las condiciones includes() de abajo
// determinan CUÁNTOS hallazgos se cuentan y no deben cambiar. Solo se enriquece
// el valor pusheado (message + location), nunca el criterio de conteo.

const MAX_LOCATION = 90;

function cap(s: string): string {
  return s.length > MAX_LOCATION ? s.slice(0, MAX_LOCATION) + "…" : s;
}

// Extrae el valor de un atributo del TAG matcheado (no del HTML entero).
// Anclado a inicio/espacio para no confundir type= con data-type=.
function attr(tag: string, name: string): string | null {
  const m = tag.match(
    new RegExp("(?:^|\\s)" + name + "\\s*=\\s*[\"']([^\"']*)[\"']", "i")
  );
  return m ? m[1] : null;
}

// Resume un src para usarlo como pista de ubicación sin inflar la respuesta:
// data-URI → solo el prefijo MIME (nunca el base64); URL → nombre de archivo.
function summarizeSrc(src: string): string {
  if (src.startsWith("data:")) {
    const comma = src.indexOf(",");
    const head = src.slice(0, comma > 0 ? Math.min(comma, 30) : 30);
    return head + " (imagen embebida)";
  }
  try {
    const segments = new URL(src).pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last) return last;
  } catch {
    /* no era URL absoluta; se trunca abajo */
  }
  return src.length > 60 ? src.slice(0, 60) + "…" : src;
}

function describeImageLocation(tag: string, index: number, total: number): string {
  const hints: string[] = [];
  const cls = attr(tag, "class");
  if (cls) hints.push('class="' + cls + '"');
  const src = attr(tag, "src");
  if (src) hints.push(summarizeSrc(src));
  const detail = hints.length > 0 ? " (" + hints.join(", ") + ")" : "";
  return cap("Imagen " + (index + 1) + " de " + total + detail);
}

function describeInputLocation(tag: string, index: number, total: number): string {
  const parts: string[] = [];
  for (const name of ["type", "name", "placeholder"]) {
    const value = attr(tag, name);
    if (value) parts.push(name + '="' + value + '"');
  }
  const fragment = parts.length > 0 ? "<input " + parts.join(" ") + ">" : "<input>";
  return cap("Campo " + (index + 1) + " de " + total + ": " + fragment);
}

export function checkImagesWithoutAlt(
  html: string
) {
  const issues: Finding[] = [];

  const matches = html.match(
    /<img[^>]*>/gi
  );

  if (!matches) {
    return issues;
  }

  for (let i = 0; i < matches.length; i++) {
    const image = matches[i];
    if (!image.includes("alt=")) {
      issues.push({
        message: "Imagen sin atributo ALT",
        location: describeImageLocation(image, i, matches.length),
      });
    }
  }

  return issues;
}

export function checkFormsWithoutLabels(
  html: string
) {
  const issues: Finding[] = [];

  const inputs = html.match(
    /<input[^>]*>/gi
  );

  if (!inputs) {
    return issues;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (
      !input.includes("aria-label") &&
      !input.includes("id=")
    ) {
      issues.push({
        message: "Campo de formulario sin label",
        location: describeInputLocation(input, i, inputs.length),
      });
    }
  }

  return issues;
}
