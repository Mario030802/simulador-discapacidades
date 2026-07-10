import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

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

    const $ = cheerio.load(html);

    $("img").each((_, element) => {
      const src = $(element).attr("src");

      if (src) {
        $(element).attr("src", new URL(src, url).href);
      }
    });

    return {
      html: $.html(),
     screenshot,
    };

  } finally {

    await browser.close();

  }
}