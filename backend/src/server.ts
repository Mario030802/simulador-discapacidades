import express from "express";
import cors from "cors";

import urlRoutes from "./routes/url.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/url",urlRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Simulador de Discapacidades API",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});