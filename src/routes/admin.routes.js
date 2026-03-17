import express from "express";
import {
  getAdminStats,
  getMonthlySales,
  getTopProducts
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);
router.get("/sales/monthly", protect, admin, getMonthlySales);
router.get("/top-products", protect, admin, getTopProducts);

export default router;