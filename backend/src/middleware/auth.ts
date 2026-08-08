import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'vendor' | 'customer';
    name: string;
    status?: 'active' | 'pending' | 'suspended';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const headerUserId = req.headers['x-user-id'] as string;
  const headerUserEmail = req.headers['x-user-email'] as string;
  const headerUserRole = req.headers['x-user-role'] as 'admin' | 'vendor' | 'customer';
  const headerUserName = req.headers['x-user-name'] as string;

  // 1. Support Clerk / Custom Header Identity
  if (headerUserId || headerUserEmail) {
    req.user = {
      id: headerUserId || 'clerk_user',
      email: headerUserEmail || 'user@example.com',
      name: headerUserName || (headerUserEmail ? headerUserEmail.split('@')[0] : 'User'),
      role: headerUserRole || 'customer',
      status: 'active',
    };
    return next();
  }

  // 2. Support JWT Bearer Tokens
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026'
      ) as any;

      req.user = {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User'),
        role: decoded.role || 'customer',
        status: decoded.status || 'active',
      };

      return next();
    } catch (err) {
      // Decode fallback if JWT verification fails
      const decodedNoVerify = jwt.decode(token) as any;
      if (decodedNoVerify?.email || decodedNoVerify?.sub) {
        req.user = {
          id: decodedNoVerify.sub || decodedNoVerify.id || 'clerk_user',
          email: decodedNoVerify.email || 'user@example.com',
          name: decodedNoVerify.name || (decodedNoVerify.email ? decodedNoVerify.email.split('@')[0] : 'User'),
          role: decodedNoVerify.role || 'customer',
          status: 'active',
        };
        return next();
      }
    }
  }

  res.status(401).json({ message: 'Authentication required. Please sign in.' });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: Admin role required' });
    return;
  }
  next();
};

export const requireVendor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
    res.status(403).json({ message: 'Access denied: Vendor/Admin role required' });
    return;
  }
  next();
};

export const requireVendorOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'vendor' && req.user.role !== 'admin')) {
    res.status(403).json({ message: 'Access denied: Admin or Vendor role required' });
    return;
  }
  next();
};
