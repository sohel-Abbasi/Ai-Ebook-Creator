import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from headers
      token = req.headers.authorization.split(" ")[1];
      //  Verify token

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized access token, token failed",
        success: false,
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access token, token failed",
      success: false,
    });
  }
};
export { protect };
