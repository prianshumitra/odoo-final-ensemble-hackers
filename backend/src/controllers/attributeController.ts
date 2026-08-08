import { Request, Response } from 'express';
import { Attribute } from '../models/Attribute.js';

export const getAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await Attribute.find().sort({ createdAt: -1 });
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attributes', error: (error as Error).message });
  }
};

export const createAttribute = async (req: Request, res: Response) => {
  try {
    const { name, values, displayType, extraPricePerValue, showVariantImages } = req.body;
    if (!name || !values || !Array.isArray(values)) {
      res.status(400).json({ message: 'Attribute name and values array are required' });
      return;
    }

    const attribute = await Attribute.create({
      name,
      values,
      displayType: displayType || 'pills',
      extraPricePerValue: extraPricePerValue || [],
      showVariantImages: !!showVariantImages,
    });

    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating attribute', error: (error as Error).message });
  }
};

export const updateAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Attribute.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Attribute not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attribute', error: (error as Error).message });
  }
};

export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Attribute.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Attribute not found' });
      return;
    }
    res.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attribute', error: (error as Error).message });
  }
};
