import express from "express";
import {
  createPaymentOrder,
  verifyPayment
} from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { orderSchema } from "../validations/order.validation.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/verify", protect, validate(orderSchema), verifyPayment);
router.post("/create-order", protect, createPaymentOrder);


export default router;