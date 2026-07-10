export async function loadUrl(url: string) {
  const response = await fetch(
    "http://localhost:3000/api/url/load",
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

  return data;
}
