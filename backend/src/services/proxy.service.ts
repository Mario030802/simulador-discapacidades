import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchPage(url: string) {
  const response = await axios.get(url);

  const html = response.data;

  const $ = cheerio.load(html);

  $("img").each((_, element) => {
    const src = $(element).attr("src");

    if (src && src.startsWith("/")) {
      $(element).attr("src", `${url}${src}`);
    }
  });

  return $.html();
}