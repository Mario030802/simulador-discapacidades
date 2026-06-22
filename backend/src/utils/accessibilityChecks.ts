export function checkContrast(html: string) {
  const issues: string[] = [];

  const suspiciousColors = [
    "#ccc",
    "#ddd",
    "#eee",
    "lightgray",
  ];

  for (const color of suspiciousColors) {
    if (html.includes(color)) {
      issues.push(
        `Posible problema de contraste: ${color}`
      );
    }
  }

  return issues;
}

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