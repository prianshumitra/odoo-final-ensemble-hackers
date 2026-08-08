import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice.js';
import { RentalOrder } from '../models/RentalOrder.js';
import { Payment } from '../models/Payment.js';
import { AuthRequest } from '../middleware/auth.js';
import { getIO } from '../socket.js';
import { generateInvoicePDFBuffer } from '../utils/pdfGenerator.js';

// GET /api/invoices
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role === 'customer') {
      filter.customerEmail = req.user.email;
    }
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

// GET /api/invoices/:id
export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice' });
  }
};

// POST /api/invoices (Create from order)
export const createInvoiceFromOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await RentalOrder.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if already invoiced
    const existing = await Invoice.findOne({ order: order._id });
    if (existing) {
      res.status(400).json({ message: 'An invoice already exists for this order.', invoice: existing });
      return;
    }

    const invoiceCount = await Invoice.countDocuments();
    const invNumber = `INV/${new Date().getFullYear()}/${(invoiceCount + 1).toString().padStart(4, '0')}`;

    const lines = order.lines.map((l) => ({
      product: l.product,
      productName: l.productName,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      amount: l.amount,
    }));

    if (order.securityDeposit?.amount > 0) {
      lines.push({
        product: 'system_deposit',
        productName: 'Security Deposit (Held)',
        quantity: 1,
        unitPrice: order.securityDeposit.amount,
        amount: order.securityDeposit.amount,
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber: invNumber,
      order: order._id,
      orderRef: order.orderRef,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 86400000),
      status: 'draft',
      lines,
      untaxedAmount: order.untaxedAmount,
      taxAmount: order.taxAmount,
      total: order.total,
    });

    order.invoiceStatus = 'invoiced';
    await order.save();

    try {
      getIO().emit('invoice:created', invoice);
    } catch (err) {}

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error: (error as Error).message });
  }
};

// PATCH /api/invoices/:id/pay (Pay / Post invoice)
export const payInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    const { paymentMethod, last4 } = req.body;

    invoice.status = 'paid';
    await invoice.save();

    const payment = await Payment.create({
      order: invoice.order,
      invoice: invoice._id,
      amount: invoice.total,
      method: paymentMethod === 'saved_card' ? 'saved_card' : 'card',
      last4: last4 || '4242',
      status: 'succeeded',
      transactionId: `TXN_${Date.now()}`,
    });

    try {
      getIO().emit('invoice:updated', invoice);
    } catch (err) {}

    res.json({ message: 'Invoice paid successfully', invoice, payment });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// GET /api/invoices/:id/print (Download / View PDF)
export const printInvoicePDF = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }
    const order = await RentalOrder.findById(invoice.order);
    const pdfBuffer = await generateInvoicePDFBuffer(invoice, order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error rendering invoice PDF' });
  }
};
