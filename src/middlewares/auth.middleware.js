import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js"; // optional (for logout blacklist)

export const protect = async (req, res, next) => {
  try {

    let token;

    //  Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //  No token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    //  Check blacklist (optional but production-ready)
    const isBlacklisted = await Token.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Session expired, please login again"
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    //  Attach user to request
    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Not authorized, invalid token"
    });

  }
};