import { Response } from 'express';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';

// GET /api/products — public storefront listing
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { search, category } = req.query;
    const filter: any = { isPublished: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
  }
};

// GET /api/products/:id
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// GET /api/products/vendor/my-products — vendor's own products (including unpublished)
export const getVendorProducts = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { vendorId: req.user?.id };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor products' });
  }
};

// POST /api/products — vendor creates a new product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, image, pricePerUnit, pricingUnit, quantityOnHand } = req.body;

    if (!name || !category || !pricePerUnit) {
      res.status(400).json({ message: 'Name, category, and price are required.' });
      return;
    }

    const product = await Product.create({
      name,
      category,
      description: description || name,
      image: image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
      pricePerUnit: Number(pricePerUnit),
      pricingUnit: pricingUnit || 'day',
      quantityOnHand: Number(quantityOnHand ?? 1),
      isPublished: true,
      vendorId: req.user!.id,
      vendorName: req.user!.name || req.user!.email,
    });

    try { getIO().emit('product:created', product); } catch (_) {}

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// PUT /api/products/:id — vendor updates their product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Only owner or admin can update
    if (req.user?.role !== 'admin' && String(product.vendorId) !== String(req.user?.id)) {
      res.status(403).json({ message: 'Not authorized to edit this product.' });
      return;
    }

    const fields = req.body;
    if (fields.name !== undefined) product.name = fields.name;
    if (fields.category !== undefined) product.category = fields.category;
    if (fields.description !== undefined) product.description = fields.description;
    if (fields.image !== undefined) product.image = fields.image;
    if (fields.pricePerUnit !== undefined) product.pricePerUnit = Number(fields.pricePerUnit);
    if (fields.pricingUnit !== undefined) product.pricingUnit = fields.pricingUnit;
    if (fields.quantityOnHand !== undefined) product.quantityOnHand = Number(fields.quantityOnHand);
    if (fields.isPublished !== undefined) product.isPublished = fields.isPublished;

    const updated = await product.save();

    try { getIO().emit('product:updated', updated); } catch (_) {}

    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.user?.role !== 'admin' && String(product.vendorId) !== String(req.user?.id)) {
      res.status(403).json({ message: 'Not authorized to delete this product.' });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);

    try { getIO().emit('product:deleted', req.params.id); } catch (_) {}

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
