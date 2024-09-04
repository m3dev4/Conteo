// tests/generateToken.test.js

import generateToken from '../utils/createToken.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Utilitaire generateToken', () => {
  let res;

  beforeEach(() => {
    res = {
      cookie: jest.fn(),
    };
  });

  it('devrait créer un token JWT valide et le stocker dans un cookie', () => {
    const userId = '123';
    const token = 'validToken';

    jwt.sign.mockReturnValue(token);

    generateToken(res, userId);

    expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.JWT_SECRET, { expiresIn: '300d' });
    expect(res.cookie).toHaveBeenCalledWith('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  });
});
