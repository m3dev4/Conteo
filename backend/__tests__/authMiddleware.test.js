// tests/authMiddleware.test.js

import jwt from 'jsonwebtoken';
import { authenticate, authorizedAdmin } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

jest.mock('../models/userModel.js');
jest.mock('jsonwebtoken');

describe('Middleware d\'authentification', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('devrait appeler next() si le token est valide', async () => {
      const user = { _id: '123', isAdmin: false };
      const token = 'validToken';

      req.cookies.jwt = token;

      jwt.verify.mockReturnValue({ userId: user._id });
      User.findById.mockResolvedValue(user);

      await authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(user._id);
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('devrait renvoyer une erreur 401 si le token est invalide', async () => {
      req.cookies.jwt = 'invalidToken';
      jwt.verify.mockImplementation(() => {
        throw new Error('Token invalide');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Vous n'êtes pas autorisé...🫤");
    });

    it('devrait renvoyer une erreur 401 si le token est manquant', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Token manquant. Vous devez être connecté pour accéder à cette ressource.');
    });
  });

  describe('authorizedAdmin', () => {
    it('devrait appeler next() si l\'utilisateur est admin', () => {
      req.user = { isAdmin: true };

      authorizedAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('devrait renvoyer une erreur 403 si l\'utilisateur n\'est pas admin', () => {
      req.user = { isAdmin: false };

      authorizedAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Accès refusé. Vous n'êtes pas autorisé à accéder à cette page...🚫");
    });
  });
});
