import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt; // Récupérer le token du cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
      req.user = await User.findById(decoded.userId).select('-password'); // Chercher l'utilisateur par ID et exclure le mot de passe
      next();
    } catch (error) {
      res.status(401).send("Vous n'êtes pas autorisé...🫤"); // Si l'utilisateur n'est pas trouvé
      return;
    }
  }
});

const authorizedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Si l'utilisateur est administrateur, passer au middleware suivant
  } else {
    res
      .status(403)
      .send(
        "Accès refusé. Vous n'êtes pas autorisé à accéder à cette page...🚫"
      );
  }
};

export { authenticate, authorizedAdmin };
