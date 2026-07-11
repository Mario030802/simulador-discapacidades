import { CATEGORY_META } from "./wcag";
import type { CategoryKey, Diagnostics, Finding } from "./wcag";

// El reporte se arma interpolando strings en HTML: todo dato que venga de la
// página analizada (ubicaciones con <p>, <input ...>, la propia URL) debe
// escaparse para que se lea como texto y no se parsee como etiquetas.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function summaryRow(key: CategoryKey, issues: Finding[]): string {
  const meta = CATEGORY_META[key];
  const ok = issues.length === 0;
  return `
<tr>
<td>${meta.title}</td>
<td>${meta.wcag}</td>
<td class="${ok ? "ok" : "error"}">
${ok ? "Sin problemas" : issues.length + " problemas"}
</td>
</tr>
`;
}

// Sección de detalle por categoría: criterio + cómo corregir UNA vez, y una
// tabla con la ubicación y el detalle de cada hallazgo. Se omite si no hay.
function detailSection(key: CategoryKey, issues: Finding[]): string {
  if (issues.length === 0) return "";
  const meta = CATEGORY_META[key];
  const rows = issues
    .map(
      (f, i) => `
<tr>
<td>${i + 1}</td>
<td>${f.location ? escapeHtml(f.location) : "—"}</td>
<td>${escapeHtml(f.message)}</td>
</tr>
`
    )
    .join("");
  return `
<h2>${meta.title} (${issues.length})</h2>

<p class="fix"><strong>${meta.wcag}</strong> — Cómo corregir: ${escapeHtml(meta.fix)}</p>

<table>

<tr>
<th>#</th>
<th>Ubicación</th>
<th>Detalle</th>
</tr>
${rows}
</table>
`;
}

export function exportReport(
  url: string,
  diagnostics: Diagnostics
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>Reporte de Accesibilidad</title>

<style>

body{
    font-family:Arial;
    padding:40px;
}

h1{
    color:#2563eb;
}

h2{
    color:#1e293b;
    margin-top:32px;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

th,td{
    border:1px solid #ddd;
    padding:10px;
    text-align:left;
    vertical-align:top;
}

th{
    background:#2563eb;
    color:white;
}

.ok{
    color:green;
    font-weight:bold;
}

.error{
    color:red;
    font-weight:bold;
}

.fix{
    color:#555;
    background:#f3f4f6;
    border-left:4px solid #2563eb;
    padding:10px 14px;
}

.fix strong{
    color:#2563eb;
}

</style>

</head>

<body>

<h1>Reporte de Accesibilidad</h1>

<p><strong>Página:</strong> ${escapeHtml(url)}</p>

<p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>

<table>

<tr>
<th>Validación</th>
<th>Criterio WCAG</th>
<th>Resultado</th>
</tr>
${summaryRow("contrast", diagnostics.contrast)}
${summaryRow("images", diagnostics.images)}
${summaryRow("forms", diagnostics.forms)}
</table>
${detailSection("contrast", diagnostics.contrast)}
${detailSection("images", diagnostics.images)}
${detailSection("forms", diagnostics.forms)}
</body>

</html>
`;

  const blob = new Blob(
    [html],
    { type: "text/html" }
  );

  const file = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = file;

  a.download = "reporte-accesibilidad.html";

  a.click();

  URL.revokeObjectURL(file);
}
