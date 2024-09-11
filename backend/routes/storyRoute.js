import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  createStory,
  deleteStory,
  getStory,
  listStory,
  updateStory,
} from '../controllers/storyController.js';
import formidable from 'formidable';

const router = express.Router();

// Middleware pour parser le formulaire avec formidable
const parseForm = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    req.body = fields;
    req.files = files;
    next();
  });
};

// Route pour lister toutes les histoires et créer une nouvelle histoire
router
  .route('/')
  .get(listStory) // Renvoie toutes les histoires
  .post(authenticate, authorizeAdmin, parseForm, createStory); // Crée une nouvelle histoire

// Route pour obtenir, mettre à jour et supprimer une histoire spécifique par son ID
router
  .route('/:id')
  .get(getStory) // Renvoie une histoire par son ID
  .put(authenticate, parseForm, updateStory) // Met à jour une histoire par son ID
  .delete(authenticate, deleteStory); // Supprime une histoire par son ID

export default router;