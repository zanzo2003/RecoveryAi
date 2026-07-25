const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../models/User');
const { register, login } = require('../auth.controller');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
jest.mock('../../models/User');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('auth.controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('register returns 400 when validation fails', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'bad input' }],
    });

    const req = { body: {} };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'bad input' }] });
  });

  it('register returns 409 when email exists', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue({ _id: 'existing' });

    const req = { body: { name: 'A', email: 'a@b.com', password: 'password123' } };
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
  });

  it('login returns 401 for invalid password', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'a@b.com', password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: 'a@b.com', password: 'wrong' } };
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('login returns token and user for valid credentials', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue({ _id: 'u1', name: 'Alice', email: 'a@b.com', password: 'hashed' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock-token');

    const req = { body: { email: 'a@b.com', password: 'password123' } };
    const res = mockRes();

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      token: 'mock-token',
      user: { id: 'u1', name: 'Alice', email: 'a@b.com' },
    });
  });
});
