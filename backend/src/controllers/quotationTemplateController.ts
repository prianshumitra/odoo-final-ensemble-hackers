import { Request, Response } from 'express';
import { QuotationTemplate } from '../models/QuotationTemplate.js';

export const getQuotationTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await QuotationTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotation templates' });
  }
};

export const createQuotationTemplate = async (req: Request, res: Response) => {
  try {
    const { name, lines, validityDays, paymentTermsPercent, headerHtml, footerHtml } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Template name is required' });
      return;
    }
    const template = await QuotationTemplate.create({
      name,
      lines: lines || [],
      validityDays: validityDays || 30,
      paymentTermsPercent: paymentTermsPercent || 100,
      headerHtml: headerHtml || '',
      footerHtml: footerHtml || '',
    });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template' });
  }
};

export const updateQuotationTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await QuotationTemplate.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating template' });
  }
};

export const deleteQuotationTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await QuotationTemplate.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template' });
  }
};
