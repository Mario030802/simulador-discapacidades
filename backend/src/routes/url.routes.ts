import { Router } from "express";

const router = Router();

router.post("/load", (req, res) => {
  const { url } = req.body;

  return res.json({
    status: "ok",
    url,
  });
});

export default router;