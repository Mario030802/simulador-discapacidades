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

  return response.json();
}