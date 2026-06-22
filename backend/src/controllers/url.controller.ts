import { Request, Response } from "express";
import { fetchPage } from "../services/proxy.service";

export async function loadUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;

    const html = await fetchPage(url);

    return res.json({
      status: "ok",
      html,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo cargar la página",
    });
  }
}