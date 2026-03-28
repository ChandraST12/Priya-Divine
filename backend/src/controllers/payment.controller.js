import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const createPaymentOrder = async (req, res) => {

  try {

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const amount = cart.totalPrice; 

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    //  Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({ success: false });
    }

    // Duplicate payment protection (WITH SESSION)
    const existingOrder = await Order.findOne({
      razorpay_payment_id
    }).session(session);

    if (existingOrder) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Payment already processed"
      });
    }

    //  Fetch cart
    const cart = await Cart.findOne({ user: req.user._id }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart empty" });
    }

    //  Amount validation (CRITICAL)
    const calculatedAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (calculatedAmount !== cart.totalPrice) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Cart amount mismatch"
      });
    }

    //  Shipping validation
    if (!req.body.shippingAddress) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Shipping address required"
      });
    }

    //  STOCK VALIDATION + DEDUCTION
    for (const item of cart.items) {

      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `${product.name} is out of stock`
        });
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    //  Create Order
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

      totalItems: cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      ),

      totalPrice: cart.totalPrice
    });

    await order.save({ session });

    //  Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ session });

    //  Commit transaction
    await session.commitTransaction();

    res.json({
      success: true,
      order
    });

  } catch (error) {

    await session.abortTransaction();

    console.error("Payment Verification Error:", error);

    res.status(500).json({ message: error.message });

  } finally {
    session.endSession();
  }

};
