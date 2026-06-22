import { Request, Response } from "express";
import { fetchPage } from "../services/proxy.service";
import { checkContrast, checkImagesWithoutAlt, checkFormsWithoutLabels } from "../utils/accessibilityChecks";

export async function loadUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;

    const html = await fetchPage(url);

    const contrastIssues = checkContrast(html);

    const imageIssues = checkImagesWithoutAlt(html);

    const formIssues =
  checkFormsWithoutLabels(html);

    return res.json({
      status: "ok",
      html,
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