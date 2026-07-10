import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { measureContrast } from "../utils/contrastCheck";

export async function fetchPage(url: string) {

  const browser = await puppeteer.launch({
    headless: true,
  });

  try {

    const page = await browser.newPage();

    await page.setViewport({
      width: 1366,
      height: 768,
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const html = await page.content();

    const screenshot = await page.screenshot({
     type: "png",
     encoding: "base64",
     fullPage: true,
});

    // Contraste real WCAG: se mide sobre la página viva (getComputedStyle) antes
    // de cerrar el navegador. Devuelve la lista de hallazgos por elemento.
    const contrast = await measureContrast(page);

    const $ = cheerio.load(html);

    // Inyecta <base> como primer hijo de <head> para que CSS/JS/fuentes/imágenes
    // con rutas relativas o root-relative resuelvan contra el sitio destino y no
    // contra el origen del frontend. Es lo que hace que la página se vea completa
    // dentro del iframe. Escapamos comillas para no romper el atributo.
    const safeUrl = url.replace(/"/g, "%22");
    if ($("head").length === 0) {
      $("html").prepend("<head></head>");
    }
    $("head").prepend(`<base href="${safeUrl}">`);

    $("img").each((_, element) => {
      const src = $(element).attr("src");

      if (src) {
        $(element).attr("src", new URL(src, url).href);
      }
    });

    return {
      html: $.html(),
     screenshot,
      contrast,
    };

  } finally {

    await browser.close();

  }
}