import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  createCategory,
  listCategory,
  readCategory,
  removeCategory,
  updateCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router
  .route('/')
  .post(authenticate, authorizeAdmin, createCategory)
  .get(authenticate, authorizeAdmin, listCategory);

router
  .route('/:categoryId')
  .put(updateCategory)
  .delete(removeCategory);

router.route('/categories').get(listCategory);

router.route('/:id').get(readCategory);

export default router;
