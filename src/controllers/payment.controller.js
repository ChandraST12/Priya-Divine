import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";


export const createPaymentOrder = async (req, res) => {

  try {

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const amount = cart.totalPrice; // ✅ trusted source

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


export const verifyPayment = async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  // ✅ prevent duplicate
  const existingOrder = await Order.findOne({
    razorpay_payment_id
  });

  if (existingOrder) {
    return res.status(400).json({
      message: "Payment already processed"
    });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart empty" });
  }

  // ✅ validate amount
  const calculatedAmount = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (calculatedAmount !== cart.totalPrice) {
    return res.status(400).json({
      message: "Cart amount mismatch"
    });
  }

  const order = new Order({
    user: req.user._id,

    razorpay_order_id,
    razorpay_payment_id,

    orderItems: cart.items.map(item => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    })),

    shippingAddress: req.body.shippingAddress,

    paymentMethod: "Razorpay",
    paymentStatus: "paid",
    paidAt: new Date(),

    totalPrice: cart.totalPrice
  });

  await order.save();

  // clear cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.json({
    success: true,
    order
  });

};