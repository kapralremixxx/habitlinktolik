import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = Router();

// Helper to generate tokens
function generateAccessToken(userId: string) {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

function generateRefreshToken(userId: string) {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  return jwt.sign({ sub: userId, typ: 'refresh' }, secret, { expiresIn });
}

// @route   POST /api/auth/register
// @desc    Register with email/password
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ message: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, password: hashed, role: 'USER' },
      });
      // TODO: send verification email
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      res.status(201).json({ accessToken, refreshToken, user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login with email/password
router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT using refresh token
router.post(
  '/refresh-token',
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      const payload = jwt.verify(refreshToken, secret) as any;
      if (payload.typ !== 'refresh') throw new Error('Invalid token type');
      const accessToken = generateAccessToken(payload.sub);
      res.json({ accessToken });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
);

// TODO: Add Google login, Apple login, forgot password, email verification routes

export default router;
