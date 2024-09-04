// tests/checkId.test.js

import checkId from '../middleware/checkId.js';
import { isValidObjectId } from 'mongoose';

jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('Middleware checkId', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('devrait appeler next() si l\'ID est valide', () => {
    isValidObjectId.mockReturnValue(true);

    checkId(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('devrait renvoyer une erreur 404 si l\'ID est invalide', () => {
    isValidObjectId.mockReturnValue(false);

    expect(() => checkId(req, res, next)).toThrowError(`Invalid Object of: ${req.params.id}`);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
