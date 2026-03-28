import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date
});

export default mongoose.model("Token", tokenSchema);