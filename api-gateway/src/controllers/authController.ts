import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username === 'demo' && password === 'demo') {
    const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: '1h' });
    return res.json({ accessToken: token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
