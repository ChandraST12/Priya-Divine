import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} from "../controllers/cart.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove/:productId", protect, removeFromCart);

export default router;