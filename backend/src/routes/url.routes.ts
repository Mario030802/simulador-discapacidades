import { Router } from "express";
import { loadUrl } from "../controllers/url.controller";

const router = Router();

router.post("/load", loadUrl);

export default router;