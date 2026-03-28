import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
const app = express();



app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);


app.use(cors({
  origin: process.env.CLIENT_URL ,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());



app.use("/uploads", express.static("uploads"));


app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/upload", uploadRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);



app.get("/", (req, res) => {
  res.send("API running");
});



app.use(errorHandler);


export default app;

