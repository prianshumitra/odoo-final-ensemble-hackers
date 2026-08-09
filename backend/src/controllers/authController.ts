import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = () => process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026';

const makeToken = (user: any) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET(),
    { expiresIn: '7d' }
  );

// Customer Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = (email || '').toLowerCase().trim();

    if (!userEmail || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ message: 'Password must be at least 4 characters.' });
      return;
    }

    const existing = await User.findOne({ email: userEmail });
    if (existing) {
      res.status(400).json({ message: 'Email already exists. Please sign in.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || userEmail.split('@')[0],
      email: userEmail,
      password: hashedPassword,
      role: 'customer',
      status: 'active',
    });

    const token = makeToken(user);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists.' });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
};

// Vendor Registration
export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { companyName, email, password, name } = req.body;
    const userEmail = (email || '').toLowerCase().trim();

    if (!companyName || !userEmail || !password) {
      res.status(400).json({ message: 'Company Name, Email, and Password are required.' });
      return;
    }

    const existing = await User.findOne({ email: userEmail });
    if (existing) {
      res.status(400).json({ message: 'Email already exists. Please sign in.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || companyName,
      companyName,
      email: userEmail,
      password: hashedPassword,
      role: 'vendor',
      status: 'active', // auto-approve for hackathon MVP
    });

    const token = makeToken(user);
    res.status(201).json({
      message: 'Vendor registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, companyName: user.companyName },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists.' });
      return;
    }
    console.error('Vendor registration error:', error);
    res.status(500).json({ message: 'Error registering vendor.' });
  }
};

// Login (for both customer and vendor)
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ message: 'Account suspended.' });
      return;
    }

    const token = makeToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, companyName: user.companyName },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
};

// Admin Login (ENV credentials)
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const envUser = process.env.ADMIN_USERNAME || 'admin@123';
    const envPass = process.env.ADMIN_PASSWORD || 'admin@123';

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    if (username.trim() !== envUser || password.trim() !== envPass) {
      res.status(401).json({ message: 'Invalid admin credentials.' });
      return;
    }

    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      const hash = await bcrypt.hash(envPass, 10);
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@ezrent.com',
        password: hash,
        role: 'admin',
        status: 'active',
      });
    }

    const token = makeToken(adminUser);
    res.json({
      message: 'Admin login successful',
      token,
      user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: 'admin', status: 'active' },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error logging in as admin.' });
  }
};

// Get current user profile
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      // Return token info if DB user not found
      res.json({ id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role, status: 'active' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
};

// Admin: list all users
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

// Admin: update user status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user.' });
  }
};
