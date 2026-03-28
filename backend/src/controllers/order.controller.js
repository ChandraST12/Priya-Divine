import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res) => {

  try {

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: req.user._id,

      orderItems: cart.items.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),

      shippingAddress: req.body.shippingAddress,

      paymentMethod: req.body.paymentMethod,

      totalPrice: cart.totalPrice
    });

    const createdOrder = await order.save();

    // clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};




export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({ user: req.user._id });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



export const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
