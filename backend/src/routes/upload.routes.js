import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("image"), (req, res) => {

  res.json({
    imageUrl: req.file.path
  });

});

export default router;