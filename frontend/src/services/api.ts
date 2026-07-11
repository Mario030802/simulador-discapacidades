import type { Diagnostics } from "../utils/wcag";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type LoadUrlResponse = {
  status: string;
  html: string;
  screenshot?: string;
  diagnostics: Diagnostics;
};

export async function loadUrl(url: string): Promise<LoadUrlResponse> {
  const response = await fetch(
    `${API_BASE}/api/url/load`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (!response.ok) {
    throw new Error(`El servidor respondió con estado ${response.status}.`);
  }

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(data.message || "No se pudo analizar la página.");
  }

  return data as LoadUrlResponse;
}
