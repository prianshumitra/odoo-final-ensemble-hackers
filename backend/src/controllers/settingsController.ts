import { Request, Response } from 'express';
import { Settings } from '../models/Settings.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        lateFeeEnabled: true,
        defaultLateFeeAmount: 150,
        variantsEnabled: true,
        pricelistEnabled: true,
        gracePeriodMinutes: 30,
        maxLateFeeCap: 5000,
        companyHeader: 'EZRent Rental Operations',
        companyFooter: 'Thank you for choosing EZRent!',
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};
