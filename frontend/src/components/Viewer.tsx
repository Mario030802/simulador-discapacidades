import { useEffect, useRef, useState } from "react";
import { buildReadingOrder, describe, type SrStop } from "../utils/screenReader";

type ViewerProps = {
  html: string;
  lowVision: boolean;
  protanopia: boolean;
  deuteranopia: boolean;
  tritanopia: boolean;
  dyslexia: boolean;
  keyboardMode: boolean;
  screenReader: boolean;
};

// Estilos que se inyectan DENTRO del documento del iframe. La dislexia (texto vivo),
// el resaltado de foco (HU7) y el resaltado del lector de pantalla (RF-11) no cruzan
// la frontera del iframe desde el CSS del padre, así que viven aquí.
//
// La fuente OpenDyslexic se sirve local desde public/fonts. La URL del @font-face
// DEBE ser absoluta al origen del frontend: el doc del iframe tiene <base href="sitio">,
// y una url() relativa resolvería contra el sitio destino. El iframe es same-origin
// (srcDoc + allow-same-origin), así que la fuente carga sin CORS.
function buildSimStyles(origin: string): string {
  return `
    @font-face {
      font-family: "OpenDyslexic";
      src: url("${origin}/fonts/OpenDyslexic-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: "OpenDyslexic";
      src: url("${origin}/fonts/OpenDyslexic-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    html.sim-dyslexia body, html.sim-dyslexia body * {
      font-family: "OpenDyslexic", Arial, Helvetica, sans-serif !important;
      letter-spacing: 2px !important;
      line-height: 2 !important;
    }
    html.sim-keyboard *:focus {
      outline: 3px solid #2563eb !important;
      outline-offset: 3px !important;
    }
    .sim-sr-current {
      outline: 4px solid #f59e0b !important;
      outline-offset: 2px !important;
      background: rgba(245, 158, 11, 0.15) !important;
      scroll-margin: 40px;
    }
  `;
}

export default function Viewer({
  html,
  lowVision,
  protanopia,
  deuteranopia,
  tritanopia,
  dyslexia,
  keyboardMode,
  screenReader,
}: ViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [stops, setStops] = useState<SrStop[]>([]);
  const [srIndex, setSrIndex] = useState(0);

  function applyClasses(doc: Document | null | undefined) {
    if (!doc || !doc.documentElement) return;
    doc.documentElement.classList.toggle("sim-dyslexia", dyslexia);
    doc.documentElement.classList.toggle("sim-keyboard", keyboardMode);
  }

  // Inyecta los estilos del simulador y aplica las clases al (re)cargar el srcDoc.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      if (!doc.getElementById("sim-injected-styles")) {
        const style = doc.createElement("style");
        style.id = "sim-injected-styles";
        style.textContent = buildSimStyles(window.location.origin);
        (doc.head || doc.documentElement).appendChild(style);
      }
      applyClasses(doc);
    };

    iframe.addEventListener("load", onLoad);
    onLoad();

    return () => iframe.removeEventListener("load", onLoad);
  }, [html, dyslexia, keyboardMode]);

  useEffect(() => {
    applyClasses(iframeRef.current?.contentDocument);
  }, [dyslexia, keyboardMode]);

  // RF-11: al activar el lector de pantalla (o cambiar de página con él activo),
  // calcula el orden de lectura del DOM del iframe. Al apagarlo, limpia.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (!screenReader) {
      setStops([]);
      setSrIndex(0);
      return;
    }
    const build = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      setStops(buildReadingOrder(doc));
      setSrIndex(0);
    };
    build();
    iframe.addEventListener("load", build);
    return () => iframe.removeEventListener("load", build);
  }, [screenReader, html]);

  // Mueve el resaltado al elemento actual dentro del iframe.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll(".sim-sr-current").forEach((e) =>
      e.classList.remove("sim-sr-current")
    );
    if (!screenReader || stops.length === 0) return;
    const cur = stops[srIndex]?.el;
    if (cur && cur.isConnected) {
      cur.classList.add("sim-sr-current");
      (cur as HTMLElement).scrollIntoView({ block: "center" });
    }
  }, [screenReader, stops, srIndex]);

  // Filtros visuales sobre el ELEMENTO iframe (daltonismo = matrices SVG; baja visión
  // = filtro CSS), encadenados en un solo `filter`. El modo lector es excluyente (Home
  // apaga estos filtros), así que aquí normalmente queda "none" con el lector activo.
  const filterParts = [
    protanopia && "url(#sim-protanopia)",
    deuteranopia && "url(#sim-deuteranopia)",
    tritanopia && "url(#sim-tritanopia)",
    lowVision && "blur(4px) contrast(0.7)",
  ].filter(Boolean);
  const filter = filterParts.length ? filterParts.join(" ") : "none";

  const total = stops.length;
  const current = stops[srIndex];
  const goNext = () => setSrIndex((i) => Math.min(i + 1, total - 1));
  const goPrev = () => setSrIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="viewer-card">
      <div className="viewer-header">Mi Página Web</div>

      <iframe
        ref={iframeRef}
        className="viewer-frame"
        title="Vista de la página cargada"
        sandbox="allow-same-origin"
        srcDoc={html}
        style={{ filter }}
      />

      {screenReader && (
        <div
          className="sr-panel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              goNext();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              goPrev();
            }
          }}
        >
          <div className="sr-title">🔊 Lector de pantalla (simulación)</div>

          {total === 0 ? (
            <p className="sr-announcement">No hay contenido para leer en esta página.</p>
          ) : (
            <>
              <p className="sr-announcement">
                <strong>
                  {srIndex + 1}/{total}
                </strong>{" "}
                — {describe(current)}
              </p>

              <div className="sr-controls">
                <button onClick={goPrev} disabled={srIndex === 0}>
                  ◀ Anterior
                </button>
                <button onClick={goNext} disabled={srIndex === total - 1}>
                  Siguiente ▶
                </button>
              </div>

              <ol className="sr-list">
                {stops.map((s, i) => (
                  <li
                    key={i}
                    className={`sr-list-item ${i === srIndex ? "active" : ""}`}
                    onClick={() => setSrIndex(i)}
                  >
                    {describe(s)}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}

      {/* Matrices de simulación de daltonismo (Machado, Oliveira & Fernandes 2009,
          severidad 1.0). El SVG vive en el documento padre para que `url(#id)` resuelva
          contra el mismo doc donde está el iframe. color-interpolation-filters queda en
          el default linearRGB, que es el espacio para el que Machado definió las matrices. */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="sim-protanopia">
            <feColorMatrix
              type="matrix"
              values="0.152286 1.052583 -0.204868 0 0
                      0.114503 0.786281 0.099216 0 0
                      -0.003882 -0.048116 1.051998 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="sim-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.367322 0.860646 -0.227968 0 0
                      0.280085 0.672501 0.047413 0 0
                      -0.011820 0.042940 0.968881 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="sim-tritanopia">
            <feColorMatrix
              type="matrix"
              values="1.255528 -0.076749 -0.178779 0 0
                      -0.078411 0.930809 0.147602 0 0
                      0.004733 0.691367 0.303900 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
