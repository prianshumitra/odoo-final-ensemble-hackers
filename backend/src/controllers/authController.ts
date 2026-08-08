import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Password Validation Helper per Spec §4.1
export const validatePasswordRule = (password: string, emailOrName?: string): string | null => {
  if (password.length < 6 || password.length > 12) {
    return 'Password length must be between 6 and 12 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[@$&_]/.test(password)) {
    return 'Password must contain at least one special character from @ $ & _';
  }
  if (emailOrName) {
    const cleanUser = emailOrName.split('@')[0].toLowerCase();
    if (password.toLowerCase() === cleanUser || password.toLowerCase() === emailOrName.toLowerCase()) {
      return 'Password cannot be identical to your email or username.';
    }
  }
  return null;
};

// Check email existence for inline verification
export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ exists: !!existing });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email' });
  }
};

// Customer Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, name, email, password, confirmPassword } = req.body;

    const userEmail = (email || '').toLowerCase().trim();
    const displayName = name || `${firstName || ''} ${lastName || ''}`.trim() || userEmail.split('@')[0];

    if (!userEmail || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ message: 'Password and Confirm Password must match.' });
      return;
    }

    const passError = validatePasswordRule(password, userEmail);
    if (passError) {
      res.status(400).json({ message: passError });
      return;
    }

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists. Please sign in with your credentials.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: displayName,
      firstName: firstName || '',
      lastName: lastName || '',
      email: userEmail,
      password: hashedPassword,
      role: 'customer',
      status: 'active',
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists. Please sign in.' });
      return;
    }
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Error registering user.' });
  }
};

// Vendor Registration (pending admin approval)
export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { companyName, gstNo, email, password, confirmPassword, name } = req.body;
    const userEmail = (email || '').toLowerCase().trim();

    if (!companyName || !userEmail || !password) {
      res.status(400).json({ message: 'Company Name, Email, and Password are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ message: 'Password and Confirm Password must match.' });
      return;
    }

    const passError = validatePasswordRule(password, userEmail);
    if (passError) {
      res.status(400).json({ message: passError });
      return;
    }

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists. Please sign in.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || companyName,
      companyName,
      gstNo: gstNo || '',
      email: userEmail,
      password: hashedPassword,
      role: 'vendor',
      status: 'pending',
    });

    res.status(201).json({
      message: 'Vendor application submitted successfully. Pending Admin approval.',
      user: {
        id: user._id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists. Please sign in.' });
      return;
    }
    res.status(400).json({ message: error.message || 'Error registering vendor.' });
  }
};

// Standard User Login (Exact error mismatch rule: "Invalid User ID or Password.")
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Invalid User ID or Password.' });
      return;
    }

    const userEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(401).json({ message: 'Invalid User ID or Password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid User ID or Password.' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ message: 'Account suspended. Please contact support.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, status: user.status },
      process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        companyName: user.companyName,
        gstNo: user.gstNo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Invalid User ID or Password.' });
  }
};

// Admin Login Panel Handler (ENV Credentials)
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const envAdminUser = process.env.ADMIN_USERNAME || 'admin@123';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'admin@123';

    if (!username || !password) {
      res.status(400).json({ message: 'Admin Username and Password are required.' });
      return;
    }

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (inputUser === envAdminUser && inputPass === envAdminPass) {
      let adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        const hash = await bcrypt.hash(envAdminPass, 10);
        adminUser = await User.create({
          name: 'System Admin',
          email: envAdminUser,
          password: hash,
          role: 'admin',
          status: 'active',
        });
      }

      const token = jwt.sign(
        { id: adminUser._id, email: adminUser.email, role: 'admin', name: 'System Admin' },
        process.env.JWT_SECRET || 'ezrent_super_secret_jwt_key_2026',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Admin Authentication Successful',
        token,
        user: {
          id: adminUser._id,
          name: 'System Admin',
          email: adminUser.email,
          role: 'admin',
          status: 'active',
        },
      });
      return;
    }

    res.status(401).json({ message: 'Invalid Admin Credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing admin login' });
  }
};

// Admin Stats
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const customersCount = await User.countDocuments({ role: 'customer' });
    const vendorsCount = await User.countDocuments({ role: 'vendor' });
    const pendingVendorsCount = await User.countDocuments({ role: 'vendor', status: 'pending' });
    const totalUsers = await User.countDocuments();

    res.json({
      customersCount,
      vendorsCount,
      pendingVendorsCount,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

// Forgot Password (Exact response message per spec §4.1)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email ID is required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'ezrent_reset_secret',
        { expiresIn: '1h' }
      );
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000);
      await user.save();
    }

    res.json({ message: 'The password reset link has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing forgot password' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      res.status(400).json({ message: 'Password and Confirm Password must match.' });
      return;
    }

    const passError = validatePasswordRule(password);
    if (passError) {
      res.status(400).json({ message: passError });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// Get Profile
export const getMe = async (req: any, res: Response) => {
  try {
    let user = null;
    if (req.user?.id) {
      user = await User.findById(req.user.id).select('-password');
    }
    if (!user && req.user?.email) {
      user = await User.findOne({ email: req.user.email }).select('-password');
    }
    if (!user) {
      res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        status: 'active',
      });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Admin List / Update Users
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};
