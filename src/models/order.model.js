import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  name: String,
  price: Number,
  image: String,

  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  razorpay_order_id: {
    type: String
  },

  razorpay_payment_id: {
    type: String,
    unique: true,
    sparse: true
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },

  paymentMethod: {
    type: String,
    default: "COD"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing"
  },

  totalItems: {
    type: Number,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: true
  },

  paidAt: Date,
  deliveredAt: Date

},
{ timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ razorpay_payment_id: 1 });

export default mongoose.model("Order", orderSchema);