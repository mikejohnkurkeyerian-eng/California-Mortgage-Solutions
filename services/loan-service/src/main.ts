import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = process.env.PORT ?? 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "loan-service" });
});

app.listen(port, () => {
  console.log(`loan-service listening on port ${port}`);
});


