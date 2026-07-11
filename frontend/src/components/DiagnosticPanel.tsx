import { CATEGORY_META } from "../utils/wcag";
import type { CategoryKey, Diagnostics, Finding } from "../utils/wcag";

type DiagnosticProps = {
  diagnostics: Diagnostics;

  onExport: () => void;
};

type ItemProps = {
  categoryKey: CategoryKey;
  issues: Finding[];
};


function DiagnosticItem({ categoryKey, issues }: ItemProps) {
  const { title, wcag, fix } = CATEGORY_META[categoryKey];
  const ok = issues.length === 0;

  if (ok) {
    return (
      <div className="diagnostic-item">
        <div>
          <strong>{title}</strong>
        </div>

        <span className="badge-ok">OK</span>
      </div>
    );
  }

  // Con problemas la fila se vuelve desplegable: el resumen mantiene el badge con
  // el conteo y al abrir se ve la guía de corrección (WCAG) y cada hallazgo con
  // su ubicación.
  return (
    <details className="diagnostic-item diagnostic-details">
      <summary>
        <strong>{title}</strong>

        <span className="badge-error">{issues.length}</span>
      </summary>

      <p className="finding-fix">
        <strong>{wcag}</strong> — {fix}
      </p>

      <ul className="finding-list">
        {issues.map((f, i) => (
          <li key={i}>
            {f.message}
            {f.location && (
              <>
                {" — "}
                <span className="finding-location">{f.location}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function DiagnosticPanel({
  diagnostics,
  onExport,
}: DiagnosticProps) {

    const totalIssues =
  diagnostics.contrast.length +
  diagnostics.images.length +
  diagnostics.forms.length;

const score = Math.max(0, 100 - totalIssues * 5);

let level = "Excelente";

if (score < 80) level = "Bueno";

if (score < 60) level = "Regular";

if (score < 40) level = "Deficiente";
  return (
  <div>
    <h2>Diagnóstico</h2>

    <div className="score-card">

  <h1>{score}/100</h1>

  <p>{level}</p>

</div>

    <DiagnosticItem
      categoryKey="contrast"
      issues={diagnostics.contrast}
    />

    <DiagnosticItem
      categoryKey="images"
      issues={diagnostics.images}
    />

    <DiagnosticItem
      categoryKey="forms"
      issues={diagnostics.forms}
    />

    <div className="export-section">
  <button className="export-btn"
    onClick={onExport}>
    Exportar reporte
  </button>
</div>
  </div>


);
}
