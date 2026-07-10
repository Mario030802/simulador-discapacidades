type FilterPanelProps = {
  lowVision: boolean;
  setLowVision: (value: boolean) => void;

  protanopia: boolean;
  setProtanopia: (value: boolean) => void;

  deuteranopia: boolean;
  setDeuteranopia: (value: boolean) => void;

  tritanopia: boolean;
  setTritanopia: (value: boolean) => void;

  dyslexia: boolean;
  setDyslexia: (value: boolean) => void;

  keyboardMode: boolean;
  setKeyboardMode: (value: boolean) => void;
};

type ToggleProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

function Toggle({ label, active, onToggle }: ToggleProps) {
  return (
    <div className="toggle-row">
      <span>{label}</span>

      <button
        className={`toggle ${active ? "active" : ""}`}
        onClick={onToggle}
      >
        <div className="toggle-circle"></div>
      </button>
    </div>
  );
}

export default function FilterPanel({
  lowVision,
  setLowVision,
  protanopia,
  setProtanopia,
  deuteranopia,
  setDeuteranopia,
  tritanopia,
  setTritanopia,
  dyslexia,
  setDyslexia,
  keyboardMode,
  setKeyboardMode,
}: FilterPanelProps) {
  return (
    <div>

      <Toggle
        label="Baja Visión"
        active={lowVision}
        onToggle={() => setLowVision(!lowVision)}
      />

      <Toggle
        label="Protanopia"
        active={protanopia}
        onToggle={() => setProtanopia(!protanopia)}
      />

      <Toggle
        label="Deuteranopia"
        active={deuteranopia}
        onToggle={() => setDeuteranopia(!deuteranopia)}
      />

      <Toggle
        label="Tritanopia"
        active={tritanopia}
        onToggle={() => setTritanopia(!tritanopia)}
      />

      <Toggle
        label="Dislexia"
        active={dyslexia}
        onToggle={() => setDyslexia(!dyslexia)}
      />

      <Toggle
        label="Modo teclado"
        active={keyboardMode}
        onToggle={() => setKeyboardMode(!keyboardMode)}
      />

    </div>
  );
}