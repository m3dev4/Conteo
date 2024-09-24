import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'

import bcrypt from 'bcrypt';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
  const { nameOfUser, username, email, password } = req.body;

  if (!nameOfUser || !username || !email || !password) {
    res.status(400);
    throw new Error('Veuillez remplir champs ci-dessous');
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('Cet utilisateur existe déjà');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    nameOfUser,
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      nameOfUser: newUser.nameOfUser,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send('Les données sont invalides');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(404); // Utilisateur non trouvé
    throw new Error("L'utilisateur n'existe pas.");
  }

  // Comparer le mot de passe
  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (isMatch) {
    // Créer un token JWT et l'envoyer dans les cookies
    createToken(res, existingUser._id);

    // Répondre avec les détails de l'utilisateur sans le mot de passe
    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name, // Utilisation correcte de 'name'
      username: existingUser.username,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });
  } else {
    res.status(401); // Mot de passe incorrect
    throw new Error('Mot de passe incorrect.');
  }
});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Déconnexion réussie' });
};

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error('Aucun utilisateur trouvé');
  }
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      nameOfUser: user.nameOfUser,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

const udpdateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updateUser = await user.save();
    res.json({
      _id: updateUser._id,
      nameOfUser: updateUser.nameOfUser,
      username: updateUser.username,
      email: updateUser.email,
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.is);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Vous ne pouvez pas supprimer un administrateur');
    }
    await User.deleteMany({ _id: user._id });
    res.json({ message: 'Utilisateur supprimé' });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updateUserId = await user.save();
    res.json({
      _id: updateUserId._id,
      nameOfUser: updateUserId.nameOfUser,
      username: updateUserId.username,
      email: updateUserId.email,
      isAdmin: updateUserId.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});


export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  udpdateUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
