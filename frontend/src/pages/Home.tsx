import { useState } from "react";
import Viewer from "../components/Viewer";
import { loadUrl } from "../services/api";
import FilterPanel from "../components/FilterPanel";
import DiagnosticPanel from "../components/DiagnosticPanel";
import { exportReport } from "../utils/report";

export default function Home() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [lowVision, setLowVision] = useState(false);
  const [protanopia, setProtanopia] = useState(false);
    const [deuteranopia, setDeuteranopia] = useState(false);
    const [dyslexia, setDyslexia] = useState(false);
    const [keyboardMode, setKeyboardMode] = useState(false);
    const [diagnostics, setDiagnostics] = useState({
  contrast: [] as string[],
  images: [] as string[],
  forms: [] as string[],
});
    const [tritanopia, setTritanopia] = useState(false);
    const [screenshot, setScreenshot] = useState("");
    
  

  const handleLoad = async () => {
    const data = await loadUrl(url);

    console.log(data);

    setHtml(data.html);
    setScreenshot(data.screenshot);
    setDiagnostics(data.diagnostics);
  };

  const handleExport = () => {
  exportReport(url, diagnostics);
};

  return (
  <div className="container">
    <header className="header">
      <h1>Simulador de Discapacidades</h1>

      <div className="search-bar">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.ulima.edu.pe"
        />

        <button onClick={handleLoad}>
          Analizar
        </button>
      </div>
    </header>

    <main className="layout">

      <aside className="sidebar">
        <h2>Filtros de simulación</h2>

        <FilterPanel
          lowVision={lowVision}
          setLowVision={setLowVision}
          protanopia={protanopia}
          setProtanopia={setProtanopia}
          deuteranopia={deuteranopia}
          setDeuteranopia={setDeuteranopia}
          dyslexia={dyslexia}
          setDyslexia={setDyslexia}
          keyboardMode={keyboardMode}
          setKeyboardMode={setKeyboardMode}
          tritanopia={tritanopia}
          setTritanopia={setTritanopia}
        />
      </aside>

      <section className="viewer-section">
        <h2>Vista de la página</h2>

        <Viewer
          html={html}
          screenshot={screenshot}
          lowVision={lowVision}
          protanopia={protanopia}
          deuteranopia={deuteranopia}
          tritanopia={tritanopia}
          dyslexia={dyslexia}
          keyboardMode={keyboardMode}
        />
      </section>

      <aside className="diagnostic-section">
        <h2>Diagnóstico</h2>

        <DiagnosticPanel diagnostics={diagnostics}
        onExport={handleExport} />
      </aside>

    </main>
  </div>
);
}