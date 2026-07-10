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
const SIM_STYLES = `
  html.sim-dyslexia body, html.sim-dyslexia body * {
    font-family: Arial, Helvetica, sans-serif !important;
    letter-spacing: 2px !important;
    line-height: 2 !important;
  }
  html.sim-keyboard *:focus {
    outline: 3px solid #2563eb !important;
    outline-offset: 3px !important;
  }
`;

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
        style.textContent = SIM_STYLES;
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

  // Los filtros visuales (color/desenfoque) van sobre el ELEMENTO iframe; el
  // filter CSS aplica sobre el render del iframe completo.
  const filterClass = [
    lowVision && "low-vision",
    protanopia && "protanopia",
    deuteranopia && "deuteranopia",
    tritanopia && "tritanopia",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="viewer-card">
      <div className="viewer-header">Mi Página Web</div>

      <iframe
        ref={iframeRef}
        className={`viewer-frame ${filterClass}`}
        title="Vista de la página cargada"
        sandbox="allow-same-origin"
        srcDoc={html}
      />
    </div>
  );
}
