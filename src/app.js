import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import stringRoutes from "./routes/stringRoutes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later."
  }
});

app.use(limiter);

app.use("/api/strings", stringRoutes);

app.get("/", (req, res) => {
    res.json({ message: "String Analyzer API is running 🚀" });
});

export default app;


