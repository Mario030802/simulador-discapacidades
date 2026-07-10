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
  const [tritanopia, setTritanopia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [diagnostics, setDiagnostics] = useState({
    contrast: [] as string[],
    images: [] as string[],
    forms: [] as string[],
  });

  const handleLoad = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Ingresa una URL para analizar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loadUrl(trimmed);
      setHtml(data.html);
      setDiagnostics(data.diagnostics);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo cargar la página. Revisa la URL e inténtalo de nuevo."
      );
      setHtml("");
    } finally {
      setLoading(false);
    }
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleLoad();
            }}
            placeholder="https://www.ulima.edu.pe"
            disabled={loading}
          />

          <button onClick={handleLoad} disabled={loading}>
            {loading ? "Analizando..." : "Analizar"}
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
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

          <DiagnosticPanel diagnostics={diagnostics} onExport={handleExport} />
        </aside>
      </main>
    </div>
  );
}
