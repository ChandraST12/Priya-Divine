import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String
  },

  images: [
    {
      url: String
    }
  ],

  stock: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);