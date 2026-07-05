type DiagnosticProps = {
  diagnostics: {
    contrast: string[];
    images: string[];
    forms: string[];
  };

  onExport: () => void;
};

type ItemProps = {
  title: string;
  issues: string[];
};


function DiagnosticItem({ title, issues }: ItemProps) {
  const ok = issues.length === 0;

  

  return (
    <div className="diagnostic-item">
      <div>
        <strong>{title}</strong>
      </div>

      <span className={ok ? "badge-ok" : "badge-error"}>
        {ok ? "OK" : issues.length}
      </span>
    </div>
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
      title="Contraste"
      issues={diagnostics.contrast}
    />

    <DiagnosticItem
      title="Imágenes sin ALT"
      issues={diagnostics.images}
    />

    <DiagnosticItem
      title="Formularios"
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