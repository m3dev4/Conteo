import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Story from '../models/storyModel.js';
import Category from '../models/categoryModel.js';

//Create a story

const createStory = asyncHandler(async (req, res) => {
  try {
    // Force la conversion des champs en chaînes de caractères
    const title = Array.isArray(req.body.title)
      ? req.body.title[0]
      : req.body.title;
    const description = Array.isArray(req.body.description)
      ? req.body.description[0]
      : req.body.description;
    const content = Array.isArray(req.body.content)
      ? req.body.content[0]
      : req.body.content;
    const category = Array.isArray(req.body.category)
      ? req.body.category[0]
      : req.body.category;

    // Vérification si les champs requis sont manquants
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Vérifier si la catégorie est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Création de l'histoire
    const story = new Story({
      title,
      description,
      content,
      category,
      author: req.user._id, // Utilisation de l'ID de l'utilisateur connecté
    });

    await story.save();

    res.status(201).json(story);
    console.log(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// read story

const getStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate('author', 'name');
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }
  res.json(story);
});

//list story

const listStory = asyncHandler(async (req, res) => {
  const stories = await Story.find({}).populate('author', 'name');
  if (!stories) {
    res.status(404);
    throw new Error('Story not found');
  }
  res.json(stories);
});

// update Story

const updateStory = asyncHandler(async (req, res) => {
  try {
    const title = Array.isArray(req.body.title)
      ? req.body.title[0]
      : req.body.title;
    const description = Array.isArray(req.body.description)
      ? req.body.description[0]
      : req.body.description;
    const content = Array.isArray(req.body.content)
      ? req.body.content[0]
      : req.body.content;
    const category = Array.isArray(req.body.category)
      ? req.body.category[0]
      : req.body.category;
    // Vérifications pour s'assurer que les champs requis sont présents
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });

    // Vérifie si la catégorie existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Mise à jour de l'histoire
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { title, description, content, category },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// delete story
const deleteStory = asyncHandler(async (req, res) => {
  try {
    // Trouve et supprime l'histoire par son ID
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export { createStory, getStory, listStory, updateStory, deleteStory };
