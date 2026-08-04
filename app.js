import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/config.js";
import v1Routes from "./router/index.js";
import logger from "./logger/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Routes mounted under /api/v1
app.use("/api/v1", v1Routes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.listen(PORT, () => {
  logger.info(`🚀 Activity Logs Service running on port ${PORT}`);
});

export default app;
