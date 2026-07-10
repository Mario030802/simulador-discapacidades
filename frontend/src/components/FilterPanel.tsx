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

  screenReader: boolean;
  setScreenReader: (value: boolean) => void;

  disableInteractive: boolean;
};

type ToggleProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

function Toggle({ label, active, onToggle, disabled }: ToggleProps) {
  return (
    <div className={`toggle-row ${disabled ? "disabled" : ""}`}>
      <span>{label}</span>

      <button
        className={`toggle ${active ? "active" : ""}`}
        onClick={onToggle}
        disabled={disabled}
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
  screenReader,
  setScreenReader,
  disableInteractive,
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
        disabled={disableInteractive}
      />

      <Toggle
        label="Modo teclado"
        active={keyboardMode}
        onToggle={() => setKeyboardMode(!keyboardMode)}
        disabled={disableInteractive}
      />

      <Toggle
        label="Lector de pantalla"
        active={screenReader}
        onToggle={() => setScreenReader(!screenReader)}
        disabled={disableInteractive}
      />

      {disableInteractive && (
        <p className="filter-note">
          Dislexia, modo teclado y lector de pantalla no aplican en la vista fiel
          (es una imagen). Usa la vista viva para esos modos.
        </p>
      )}

    </div>
  );
}
