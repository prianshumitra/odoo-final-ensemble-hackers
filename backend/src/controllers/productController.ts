import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { brand, color, duration, maxPrice, search } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (brand && brand !== 'All Brands') {
      filter.brand = brand;
    }

    if (color) {
      filter['colorVariants.name'] = { $regex: color, $options: 'i' };
    }

    if (duration && duration !== 'All Duration') {
      filter.duration = duration;
    }

    if (maxPrice) {
      filter['pricing.amount'] = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: (error as Error).message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      amount,
      unit,
      duration,
      description,
      image,
      colorVariants,
      sizeVariants,
      inStock,
    } = req.body;

    if (!name || !brand || !category || !amount || !description || !image) {
      res.status(400).json({ message: 'Missing required product fields' });
      return;
    }

    const formattedColors = colorVariants && colorVariants.length > 0 
      ? colorVariants 
      : [{ name: 'Standard', hex: '#18181B' }];

    const newProduct = await Product.create({
      name,
      brand,
      category,
      pricing: {
        amount: Number(amount),
        unit: unit || 'Month',
      },
      duration: duration || '6 Month',
      description,
      image,
      colorVariants: formattedColors,
      sizeVariants: sizeVariants || [],
      inStock: inStock !== undefined ? inStock : true,
      vendorId: req.user?.id || 'vendor_demo',
      vendorName: req.user?.name || req.user?.email || 'Vendor Store',
    });

    // ⚡ Realtime broadcast: Emit to all connected clients
    try {
      getIO().emit('product:created', newProduct);
      console.log(`📡 Broadcasted product:created for "${newProduct.name}"`);
    } catch (err) {
      console.warn('Socket broadcast warning:', (err as Error).message);
    }

    res.status(201).json({
      message: 'Product listed successfully for rent!',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
};

export const getVendorProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ vendorId: req.user?.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor products' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const {
      name,
      brand,
      category,
      amount,
      unit,
      duration,
      description,
      image,
      colorVariants,
      sizeVariants,
      inStock,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (amount !== undefined) product.pricing = { amount: Number(amount), unit: unit || product.pricing.unit };
    if (duration !== undefined) product.duration = duration;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (colorVariants !== undefined) product.colorVariants = colorVariants;
    if (sizeVariants !== undefined) product.sizeVariants = sizeVariants;
    if (inStock !== undefined) product.inStock = inStock;

    const updatedProduct = await product.save();

    // ⚡ Realtime broadcast
    try {
      getIO().emit('product:updated', updatedProduct);
      console.log(`📡 Broadcasted product:updated for "${updatedProduct.name}"`);
    } catch (err) {
      console.warn('Socket broadcast warning:', (err as Error).message);
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);

    // ⚡ Realtime broadcast
    try {
      getIO().emit('product:deleted', req.params.id);
      console.log(`📡 Broadcasted product:deleted for ${req.params.id}`);
    } catch (err) {
      console.warn('Socket broadcast warning:', (err as Error).message);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
