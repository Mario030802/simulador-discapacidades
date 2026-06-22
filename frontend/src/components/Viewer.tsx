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
    <div
      style={{
        filter: lowVision
            ? "blur(8px) contrast(70%)"
            : protanopia
            ? "grayscale(100%)"
            : deuteranopia
            ? "sepia(100%)"
            : "none",

        letterSpacing: dyslexia ? "3px" : "normal",
        lineHeight: dyslexia ? "2" : "normal",

        outline: keyboardMode ? "4px solid yellow" : "none",
      }}

      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}