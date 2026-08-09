import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'vendor' | 'customer';
    name: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026'
    ) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.email?.split('@')[0] || 'User',
      role: decoded.role || 'customer',
    };

    return next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token. Please sign in again.' });
    return;
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required.' });
    return;
  }
  next();
};

export const requireVendor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
    res.status(403).json({ message: 'Vendor access required.' });
    return;
  }
  next();
};

export const requireVendorOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
    res.status(403).json({ message: 'Vendor or Admin access required.' });
    return;
  }
  next();
};
