import { useState } from "react";
import Viewer from "../components/Viewer";
import { loadUrl } from "../services/api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");

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

      <hr />

      <Viewer html={html} />
    </div>
  );
}