// Nota: el chequeo de contraste ya NO vive aquí. Se movió a una medición real
// WCAG dentro de Puppeteer (ver utils/contrastCheck.ts), porque el contraste
// necesita los colores computados de la página renderizada, no el string HTML.

export function checkImagesWithoutAlt(
  html: string
) {
  const issues: string[] = [];

  const matches = html.match(
    /<img[^>]*>/gi
  );

  if (!matches) {
    return issues;
  }

  for (const image of matches) {
    if (!image.includes("alt=")) {
      issues.push(
        "Imagen sin atributo ALT"
      );
    }
  }

  return issues;
}

export function checkFormsWithoutLabels(
  html: string
) {
  const issues: string[] = [];

  const inputs = html.match(
    /<input[^>]*>/gi
  );

  if (!inputs) {
    return issues;
  }

  for (const input of inputs) {
    if (
      !input.includes("aria-label") &&
      !input.includes("id=")
    ) {
      issues.push(
        "Campo de formulario sin label"
      );
    }
  }

  return issues;
}