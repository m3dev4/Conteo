import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/UserModel.js";

// Middleware d'authentification
const authenticate = asyncHandler(async (req, res, next) => {
  console.log("Début du middleware d'authentification");
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);

  let token;

  // Vérifie si le token est dans les cookies
  token = req.cookies.jwt;

  if (token) {
    console.log("Token trouvé:", token);
    try {
      // Vérifie et décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token décodé:", decoded);
      
      // Trouve l'utilisateur correspondant au token
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        console.log("Utilisateur non trouvé pour l'ID:", decoded.userId);
        res.status(401);
        throw new Error("User not found");
      }

      console.log("Utilisateur authentifié:", req.user);
      next();
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    console.log("Aucun token trouvé dans les cookies");
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// Middleware d'autorisation d'administrateur
const authorizeAdmin = (req, res, next) => {
  console.log("Vérification des droits d'administrateur");
  console.log("Utilisateur:", req.user);

  if (req.user && req.user.isAdmin) {
    console.log("Utilisateur autorisé en tant qu'admin");
    next();
  } else {
    console.log("Utilisateur non autorisé en tant qu'admin");
    res.status(403).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };