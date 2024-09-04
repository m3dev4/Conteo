// tests/asyncHandler.test.js

import asyncHandler from '../middleware/asyncHandler.js';

describe('Middleware asyncHandler', () => {
  it('devrait appeler la fonction passée et appeler next() en cas de succès', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const req = {};
    const res = {};
    const next = jest.fn();

    await asyncHandler(mockFn)(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('devrait attraper les erreurs et envoyer une réponse avec le message d\'erreur', async () => {
    const mockError = new Error('Erreur de test');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await asyncHandler(mockFn)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    expect(next).not.toHaveBeenCalled();
  });
});
