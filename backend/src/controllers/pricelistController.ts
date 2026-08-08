import { Request, Response } from 'express';
import { Pricelist } from '../models/Pricelist.js';

export const getPricelists = async (req: Request, res: Response) => {
  try {
    const pricelists = await Pricelist.find().sort({ createdAt: -1 });
    res.json(pricelists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricelists', error: (error as Error).message });
  }
};

export const createPricelist = async (req: Request, res: Response) => {
  try {
    const { name, isDefault, validFrom, validTo, rules } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Pricelist name is required' });
      return;
    }

    if (isDefault) {
      await Pricelist.updateMany({}, { isDefault: false });
    }

    const pricelist = await Pricelist.create({
      name,
      isDefault: !!isDefault,
      validFrom,
      validTo,
      rules: rules || [],
    });

    res.status(201).json(pricelist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pricelist', error: (error as Error).message });
  }
};

export const updatePricelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (req.body.isDefault) {
      await Pricelist.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }
    const updated = await Pricelist.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Pricelist not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pricelist', error: (error as Error).message });
  }
};

export const deletePricelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Pricelist.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Pricelist not found' });
      return;
    }
    res.json({ message: 'Pricelist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricelist', error: (error as Error).message });
  }
};
