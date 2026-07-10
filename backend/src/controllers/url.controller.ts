import { Request, Response } from "express";
import { fetchPage } from "../services/proxy.service";
import { checkImagesWithoutAlt, checkFormsWithoutLabels } from "../utils/accessibilityChecks";

export async function loadUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;

    const { html, screenshot, contrast } = await fetchPage(url);

    // El contraste ahora se mide de verdad (WCAG) dentro de Puppeteer; llega ya
    // calculado desde fetchPage. alt e inputs siguen con los checks sobre el HTML.
    const contrastIssues = contrast;

    const imageIssues = checkImagesWithoutAlt(html);

    const formIssues =
  checkFormsWithoutLabels(html);

    return res.json({
  status: "ok",
  html,
  screenshot,
  diagnostics: {
    contrast: contrastIssues,
    images: imageIssues,
    forms: formIssues,
  },
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "No se pudo analizar la página",
    });
  }
}