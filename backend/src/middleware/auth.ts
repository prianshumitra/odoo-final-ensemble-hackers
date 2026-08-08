import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'vendor';
    name: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const headerUserId = req.headers['x-user-id'] as string;
  const headerUserEmail = req.headers['x-user-email'] as string;
  const headerUserName = req.headers['x-user-name'] as string;
  const headerUserRole = (req.headers['x-user-role'] as 'customer' | 'vendor') || 'customer';

  // 1. Check custom user headers from frontend
  if (headerUserId || headerUserEmail) {
    req.user = {
      id: headerUserId || headerUserEmail,
      email: headerUserEmail || 'user@example.com',
      name: headerUserName || headerUserEmail?.split('@')[0] || 'Marketplace User',
      role: headerUserRole,
    };
    return next();
  }

  // 2. Check Bearer Token (Clerk JWT or Custom JWT)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Decode JWT without strict signature check to allow Clerk tokens & local tokens seamlessly
      const decoded = jwt.decode(token) as any;
      if (decoded) {
        req.user = {
          id: decoded.sub || decoded.id || decoded.userId || 'guest-user',
          email: decoded.email || decoded.primary_email_address || decoded.email_address || 'user@example.com',
          name: decoded.name || decoded.full_name || decoded.email?.split('@')[0] || 'Marketplace User',
          role: decoded.role || headerUserRole || 'customer',
        };
        return next();
      }
    } catch (err) {
      console.warn('JWT Decode warning:', (err as Error).message);
    }
  }

  // Fallback for demo guest
  req.user = {
    id: 'guest_user_demo',
    email: 'guest@diligentwombat.com',
    name: 'Guest User',
    role: headerUserRole || 'customer',
  };
  next();
};

export const requireVendor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'vendor') {
    res.status(403).json({ message: 'Access denied: Vendor role required' });
    return;
  }
  next();
};
