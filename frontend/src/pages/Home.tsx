import { useState } from "react";
import Viewer from "../components/Viewer";
import { loadUrl } from "../services/api";
import FilterPanel from "../components/FilterPanel";

export default function Home() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [lowVision, setLowVision] = useState(false);
  const [protanopia, setProtanopia] = useState(false);
    const [deuteranopia, setDeuteranopia] = useState(false);
    const [dyslexia, setDyslexia] = useState(false);
    const [keyboardMode, setKeyboardMode] = useState(false);
  

  const handleLoad = async () => {
    const data = await loadUrl(url);

    console.log(data);

    setHtml(data.html);
  };

  return (
    <div>
      <h1>Simulador de Discapacidades</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.ulima.edu.pe"
      />

      <button onClick={handleLoad}>
    Analizar
    </button>

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
/>
      <hr />

      <Viewer
        html={html}
        lowVision={lowVision}
        protanopia={protanopia}
        deuteranopia={deuteranopia}
        dyslexia={dyslexia}
        keyboardMode={keyboardMode}
    />
    </div>
  );
}