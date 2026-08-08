import { Request, Response } from 'express';
import { RentalOrder } from '../models/RentalOrder.js';
import { Invoice } from '../models/Invoice.js';
import { AuthRequest } from '../middleware/auth.js';

export const getReportData = async (req: AuthRequest, res: Response) => {
  try {
    const { format } = req.query; // 'csv', 'excel', 'json'
    const filter: any = {};

    if (req.user?.role === 'vendor') {
      filter.vendorId = req.user.id;
    }

    const orders = await RentalOrder.find(filter).sort({ createdAt: -1 });

    if (format === 'csv' || format === 'excel') {
      const csvHeaders = 'OrderRef,Customer,Status,Total,DepositAmount,DepositStatus,LateFee,PickupDate,ReturnDate\n';
      const csvRows = orders
        .map((o) => {
          return `"${o.orderRef}","${o.customerName}","${o.status}",${o.total},${o.securityDeposit?.amount || 0},"${o.securityDeposit?.status || 'none'}",${o.lateFeeCalculated || 0},"${o.rentalPeriod?.start ? new Date(o.rentalPeriod.start).toISOString().split('T')[0] : ''}","${o.rentalPeriod?.end ? new Date(o.rentalPeriod.end).toISOString().split('T')[0] : ''}"`;
        })
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=Rental_Report_${Date.now()}.csv`);
      res.send(csvHeaders + csvRows);
      return;
    }

    // Default JSON report
    res.json({
      role: req.user?.role || 'admin',
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
};
