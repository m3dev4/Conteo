import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/UserModel.js";

// Middleware d'authentification
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifie si le token est dans les cookies
  token = req.cookies.jwt;

  if (token) {
    try {
      // Vérifie et décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Trouve l'utilisateur correspondant au token
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// Middleware d'autorisation d'administrateur
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };
