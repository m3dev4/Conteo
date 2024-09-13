import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  createStory,
  deleteStory,
  getAllStories,
  getStoryById,
  updateStory,
} from '../controllers/storyController.js';
import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChapterByStory,
  updateChapter,
} from '../controllers/chapterController.js';
import formidable from 'express-formidable';
import { upload } from './uploadRoute.js';

const router = express.Router();

router
  .post('/stories', authenticate, authorizeAdmin, upload.single('coverImage'),  createStory)
  .get('/stories', getAllStories)

router  
  .route('/stories/:id')
  .get(getStoryById)
  .put(updateStory)
  .delete(deleteStory);

router
  .post(
    '/stories/:storyId/chapters',
    authenticate,
    authorizeAdmin,
    createChapter
  )
  .get( '/stories/:storyId/chapters', getChapterByStory )
  .get('/chapters/:id',  getChapterById)
  .put('/chapters/:id',  updateChapter)
  .delete('/chapters/:id',  deleteChapter);

export default router;
