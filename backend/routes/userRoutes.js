import express from 'express';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  loginUser,
  logoutUser,
  udpdateUserProfile,
  updateUserById,
} from '../controllers/userController.js';

import {
  authenticate,
  authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post('/login', loginUser);
router.post('/logout', logoutUser);

router
  .route('/profile')
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, udpdateUserProfile);

router
  .route('/id')
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;
