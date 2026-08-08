import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { brand, category, color, duration, maxPrice, priceRange, search, includeUnpublished } = req.query;
    const filter: any = {};

    // Customer storefront filter: default to published only
    if (includeUnpublished !== 'true') {
      filter.isPublished = true;
    }

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

    if (category && category !== 'All Categories') {
      filter.category = category;
    }

    if (color) {
      filter['colorVariants.name'] = { $regex: color, $options: 'i' };
    }

    if (duration && duration !== 'All Duration') {
      filter.duration = duration;
    }

    const priceCap = maxPrice || priceRange;
    if (priceCap) {
      filter['pricing.amount'] = { $lte: Number(priceCap) };
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
      type,
      salesPrice,
      costPrice,
      quantityOnHand,
      amount,
      unit,
      duration,
      description,
      image,
      images,
      colorVariants,
      sizeVariants,
      attributes,
      rental,
      inStock,
      isPublished,
      isSystemProduct,
    } = req.body;

    if (!name || (!amount && !salesPrice) || !category) {
      res.status(400).json({ message: 'Product name, category, and sales price are required' });
      return;
    }

    const finalSalesPrice = Number(salesPrice || amount || 0);
    const formattedColors = colorVariants && colorVariants.length > 0 
      ? colorVariants 
      : [{ name: 'Standard', hex: '#18181B' }];

    const newProduct = await Product.create({
      name,
      brand: brand || 'Generic',
      category,
      type: type || 'goods',
      salesPrice: finalSalesPrice,
      costPrice: Number(costPrice || 0),
      quantityOnHand: Number(quantityOnHand !== undefined ? quantityOnHand : 10),
      pricing: {
        amount: finalSalesPrice,
        unit: unit || 'Month',
      },
      duration: duration || '6 Month',
      description: description || name,
      image: image || (images && images[0]) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
      images: images || [image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop'],
      colorVariants: formattedColors,
      sizeVariants: sizeVariants || [],
      attributes: attributes || [],
      rental: rental || {
        periodicity: 'day',
        windowStart: '10:00',
        windowEnd: '19:00',
        paddingTimeMinutes: 120,
        lateFeeRatePerUnit: 150,
        depositType: 'fixed',
        depositValue: 500,
      },
      inStock: inStock !== undefined ? inStock : true,
      isPublished: isPublished !== undefined ? isPublished : true,
      isSystemProduct: !!isSystemProduct,
      vendorId: req.user?.id || 'vendor_demo',
      vendorName: req.user?.name || req.user?.email || 'Vendor Store',
    });

    try {
      getIO().emit('product:created', newProduct);
    } catch (err) {}

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
  }
};

export const getVendorProducts = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { vendorId: req.user?.id };
    const products = await Product.find(filter).sort({ createdAt: -1 });
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

    const fields = req.body;
    if (fields.name !== undefined) product.name = fields.name;
    if (fields.brand !== undefined) product.brand = fields.brand;
    if (fields.category !== undefined) product.category = fields.category;
    if (fields.type !== undefined) product.type = fields.type;
    if (fields.salesPrice !== undefined || fields.amount !== undefined) {
      const val = Number(fields.salesPrice || fields.amount);
      product.salesPrice = val;
      product.pricing.amount = val;
    }
    if (fields.costPrice !== undefined) product.costPrice = Number(fields.costPrice);
    if (fields.quantityOnHand !== undefined) product.quantityOnHand = Number(fields.quantityOnHand);
    if (fields.duration !== undefined) product.duration = fields.duration;
    if (fields.description !== undefined) product.description = fields.description;
    if (fields.image !== undefined) product.image = fields.image;
    if (fields.images !== undefined) product.images = fields.images;
    if (fields.colorVariants !== undefined) product.colorVariants = fields.colorVariants;
    if (fields.sizeVariants !== undefined) product.sizeVariants = fields.sizeVariants;
    if (fields.attributes !== undefined) product.attributes = fields.attributes;
    if (fields.rental !== undefined) product.rental = { ...product.rental, ...fields.rental };
    if (fields.inStock !== undefined) product.inStock = fields.inStock;
    if (fields.isPublished !== undefined && req.user?.role === 'admin') {
      product.isPublished = fields.isPublished;
    }

    const updatedProduct = await product.save();

    try {
      getIO().emit('product:updated', updatedProduct);
    } catch (err) {}

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
  }
};

// Admin only: Publish / Unpublish product
export const togglePublishProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Validation rule: Reject publishing if missing required fields (§ 9)
    if (!product.isPublished) {
      if (!product.name || !product.salesPrice || !product.category) {
        res.status(400).json({ message: 'Cannot publish product missing required fields (name, price, category).' });
        return;
      }
    }

    product.isPublished = !product.isPublished;
    await product.save();

    try {
      getIO().emit('product:updated', product);
    } catch (err) {}

    res.json({
      message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: product.isPublished,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling publish state' });
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

    try {
      getIO().emit('product:deleted', req.params.id);
    } catch (err) {}

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
