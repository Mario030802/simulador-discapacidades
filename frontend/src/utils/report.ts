type Diagnostics = {
  contrast: string[];
  images: string[];
  forms: string[];
};

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

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

th,td{
    border:1px solid #ddd;
    padding:10px;
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

</style>

</head>

<body>

<h1>Reporte de Accesibilidad</h1>

<p><strong>Página:</strong> ${url}</p>

<p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>

<table>

<tr>
<th>Validación</th>
<th>Resultado</th>
</tr>

<tr>
<td>Contraste</td>
<td class="${
    diagnostics.contrast.length === 0
      ? "ok"
      : "error"
}">
${
    diagnostics.contrast.length === 0
      ? "Sin problemas"
      : diagnostics.contrast.length + " problemas"
}
</td>
</tr>

<tr>
<td>Imágenes ALT</td>
<td class="${
    diagnostics.images.length === 0
      ? "ok"
      : "error"
}">
${
    diagnostics.images.length === 0
      ? "Sin problemas"
      : diagnostics.images.length + " problemas"
}
</td>
</tr>

<tr>
<td>Formularios</td>
<td class="${
    diagnostics.forms.length === 0
      ? "ok"
      : "error"
}">
${
    diagnostics.forms.length === 0
      ? "Sin problemas"
      : diagnostics.forms.length + " problemas"
}
</td>
</tr>

</table>

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