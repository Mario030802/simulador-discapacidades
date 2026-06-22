type FilterPanelProps = {
  lowVision: boolean;
  setLowVision: (value: boolean) => void;

  protanopia: boolean;
  setProtanopia: (value: boolean) => void;

  deuteranopia: boolean;
  setDeuteranopia: (value: boolean) => void;

  dyslexia: boolean;
  setDyslexia: (value: boolean) => void;

  keyboardMode: boolean;
    setKeyboardMode: (value: boolean) => void;
};

export default function FilterPanel({
  lowVision,
  setLowVision,
  protanopia,
  setProtanopia,
  deuteranopia,
  setDeuteranopia,
  dyslexia,
  setDyslexia,
  keyboardMode,
  setKeyboardMode,
}: FilterPanelProps) {
  return (
    <div>
      <h3>Filtros</h3>

      <button onClick={() => setLowVision(!lowVision)}>
        Baja Visión
      </button>

      <button onClick={() => setProtanopia(!protanopia)}>
        Protanopia
      </button>

      <button onClick={() => setDeuteranopia(!deuteranopia)}>
        Deuteranopia
      </button>

      <button onClick={() => setDyslexia(!dyslexia)}>
        Dislexia
      </button>

      <button onClick={() => setKeyboardMode(!keyboardMode)}>
        Modo Teclado
        </button>
    </div>
  );
}