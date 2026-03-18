import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },

      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },

      { $unwind: "$orderItems" },

      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },

      { $sort: { totalSold: -1 } },

      { $limit: 5 },

      //  join with products collection
      {
        $lookup: {
          from: "products", // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // flatten array
      { $unwind: "$productDetails" },

      // select useful fields
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          price: "$productDetails.price",
          image: { $arrayElemAt: ["$productDetails.images.url", 0] },
          totalSold: 1,
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
