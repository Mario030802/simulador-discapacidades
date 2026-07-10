import { useEffect, useRef } from "react";

type ViewerProps = {
  html: string;
  lowVision: boolean;
  protanopia: boolean;
  deuteranopia: boolean;
  tritanopia: boolean;
  dyslexia: boolean;
  keyboardMode: boolean;
};

// Estilos que se inyectan DENTRO del documento del iframe. La dislexia (texto vivo)
// y el resaltado de foco (HU7) no cruzan la frontera del iframe desde el CSS del
// padre, así que viven aquí, gateados por clases en el <html> del propio iframe.
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
}: ViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function applyClasses(doc: Document | null | undefined) {
    if (!doc || !doc.documentElement) return;
    doc.documentElement.classList.toggle("sim-dyslexia", dyslexia);
    doc.documentElement.classList.toggle("sim-keyboard", keyboardMode);
  }

  // Cuando el iframe termina de cargar un srcDoc nuevo, inyecta los estilos del
  // simulador una vez y aplica las clases actuales. Se re-liga con cada cambio de
  // html/dislexia/teclado para capturar el estado más reciente en el load.
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
    // Por si el srcDoc ya está cargado al correr el efecto.
    onLoad();

    return () => iframe.removeEventListener("load", onLoad);
  }, [html, dyslexia, keyboardMode]);

  // Togglear dislexia / teclado sin recargar el iframe (documento ya listo).
  useEffect(() => {
    applyClasses(iframeRef.current?.contentDocument);
  }, [dyslexia, keyboardMode]);

  // Los filtros van sobre el ELEMENTO iframe. Daltonismo = matrices SVG feColorMatrix
  // (definidas en el <svg> oculto de abajo); baja visión = filtros CSS. Se ENCADENAN en
  // un solo `filter` inline para que combinarlos no haga que uno pise al otro (antes,
  // dos clases con `filter:` competían y ganaba una sola). El orden aplica la matriz de
  // color primero y luego el desenfoque/contraste.
  const filterParts = [
    protanopia && "url(#sim-protanopia)",
    deuteranopia && "url(#sim-deuteranopia)",
    tritanopia && "url(#sim-tritanopia)",
    lowVision && "blur(4px) contrast(0.7)",
  ].filter(Boolean);
  const filter = filterParts.length ? filterParts.join(" ") : "none";

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

      {/* Matrices de simulación de daltonismo (Machado, Oliveira & Fernandes 2009,
          severidad 1.0). El SVG vive en el documento padre para que `url(#id)` resuelva
          contra el mismo doc donde está el iframe. color-interpolation-filters queda en
          el default linearRGB, que es el espacio para el que Machado definió las matrices. */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
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
