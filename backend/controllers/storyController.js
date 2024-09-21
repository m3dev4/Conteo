import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
import { Chapter, Story } from '../models/storiesModel.js';
import mongoose from 'mongoose';

// Creation d'histoire avec des logs et des verification pour mieux anticiper les erreurs.

const createStory = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  const coverImage = req.file.path;

  // Vérifications des champs requis
  if (!title) {
    return res.status(400).json({ message: 'Veuillez remplir le titre' });
  }
  if (!description) {
    return res.status(400).json({ message: 'Veuillez remplir la description' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Veuillez spécifier la catégorie' });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ message: 'Veuillez ajouter une image de couverture' });
  }

  try {
    
    const categoryId = new mongoose.Types.ObjectId(category)

    const story = new Story({
      title,
      description,
      category: categoryId,
      author: req.user._id,
      coverImage: coverImage
    });

    await story.save();
    console.log("Nouvelle histoire créée:", story); // Ajoutez ce log
    res.status(201).json(story);
  } catch (error) {
    console.error("Erreur lors de la création de l'histoire:", error);
    res.status(400).json({ message: error.message });
  }
});

const getAllStories = asyncHandler(async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'name');
    res.status(200).json(stories);
  } catch (error) {}
});

const getStoryById = asyncHandler(async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate(
      'author',
      'name'
    );
    if (!story)
      return res.status(404).json({ message: 'Histoire non trouvée' });
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const getStoryByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log("Fetching stories for category slug:", slug);

  try {
    const category = await Category.findOne({ slug });
    console.log("Found category:", category);

    if (!category) {
      console.log("Category not found");
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    const stories = await Story.find({ category: category._id })
      .populate('author', 'name')
      .populate('category', 'name slug');

      console.log("Category ID used for query:", category._id.toString());
      console.log("Stories found:", stories.map(s => ({ id: s._id.toString(), title: s.title, categoryId: s.category.toString() })));

    console.log("Found stories:", stories);


    res.status(200).json(stories);
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires par catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const updateStory = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  try {
    // Vérification des champs obligatoires avec retour immédiat après chaque erreur
    // switch (true) {
    //   case !title:
    //     return res.status(400).json({ message: 'Veuillez remplir le titre' });
    //   case !description:
    //     return res.status(400).json({ message: 'Veuillez remplir la description' });
    //   case !category:
    //     return res.status(400).json({ message: 'Veuillez spécifier la catégorie' });
    //   default:
    //     break;
    // }

    // Mise à jour de l'histoire avec des champs sécurisés et la nouvelle catégorie
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category: new mongoose.Types.ObjectId(category), // Correction de la variable ici
      },
      { new: true, runValidators: true } // Exécute les validateurs
    );

    if (!updatedStory) {
      return res.status(404).json({ message: 'Histoire non trouvée' });
    }

    res.status(200).json(updatedStory); // Retourne l'histoire mise à jour
    console.log(updatedStory); // Affiche l'histoire mise à jour dans la console
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'histoire:", error); // Logging amélioré
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const deleteStory = asyncHandler(async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      res.status(404).send('Histoire non trouvée');
      console.error(error);
    }
    await Chapter.deleteMany({ story: req.params.id });
    res.status(200).json({ message: 'Histoire supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
    console.error(error);
  }
});

export { createStory, getAllStories, getStoryById, getStoryByCategory , updateStory, deleteStory };
