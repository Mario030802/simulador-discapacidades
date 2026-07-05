type ViewerProps = {
  html: string;
  lowVision: boolean;
  protanopia: boolean;
  deuteranopia: boolean;
  dyslexia: boolean;
  keyboardMode:boolean;
};

export default function Viewer({
  html,
  lowVision,
  protanopia,
  deuteranopia,
  dyslexia,
  keyboardMode,
}: ViewerProps) {
  return (
  <div className="viewer-card">

    <div className="viewer-header">
      Mi Página Web
    </div>

    <div
  className={`
    viewer-content
    ${lowVision ? "low-vision" : ""}
    ${protanopia ? "protanopia" : ""}
    ${deuteranopia ? "deuteranopia" : ""}
    ${dyslexia ? "dyslexia" : ""}
    ${keyboardMode ? "keyboard-mode" : ""}
  `}
  dangerouslySetInnerHTML={{
    __html: html,
  }}
/>

  </div>
);
}