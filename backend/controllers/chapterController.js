import asyncHandler from '../middleware/asyncHandler.js';
import { Chapter, Story } from '../models/storiesModel.js';

const createChapter = asyncHandler(async (req, res) => {
  const { title, content, chapterNumber } = req.body;
  const storyId = req.params.storyId;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      res.status(404);
      throw new Error('Histoire non trouvée');
    }

    const newChapter = new Chapter({
      title,
      content,
      story: storyId,
      chapterNumber,
    });

    const savedChapter = await newChapter.save();

    story.updatedAt = Date.now();
    await story.save();

    res.status(201).json(savedChapter);
  } catch (error) {
    console.error('Erreur lors de la création du chapitre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

const getChapterByStory = asyncHandler(async (req, res) => {
  try {
    const chapters = await Chapter.find({
      story: req.params.storyId,
    }).sort({ chapterNumber: 1 });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
    console.error(error);
  }
});

const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate(
      'story',
      'title'
    );
    if (!chapter)
      return res.status(404).json({ message: 'Chapitre non trouvé' });
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChapter = asyncHandler(async (req, res) => {
  const { title, content, chapterNumber } = req.body;
  switch (true) {
    case !title:
      res.status(400);
      throw new Error('Veuillez entrer un titre');
      break;
    case !content:
      res.status(400);
      throw new Error('Veuillez entrer un contenu');
      break;
    case !chapterNumber:
      res.status(400);
      throw new Error('Veuillez entrer un numéro de chapitre');
      break;
  }
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { title, content, chapterNumber },
      { new: true }
    );
    if (!updatedChapter) {
      res.status(404);
      throw new Error('Chapitre non trouvé');
    }
    res.status(200).json(updatedChapter);
    console.log(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
});

const deleteChapter = asyncHandler(async (req, res) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!deletedChapter) {
      res.status(404);
      throw new Error('Chapitre non trouvé');
    }
    await Story.findByIdAndUpdate(deletedChapter.story, {
      updatedAt: Date.now(),
    });
    res.status(200).json({ message: 'Chapitre supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
});

export {
  createChapter,
  getChapterByStory,
  getChapterById,
  updateChapter,
  deleteChapter,
};