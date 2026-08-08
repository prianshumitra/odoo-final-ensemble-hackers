import { Request, Response } from 'express';
import { RentalOrder } from '../models/RentalOrder.js';
import { Invoice } from '../models/Invoice.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

export const getDashboardKPIs = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.user?.role === 'vendor') {
      filter.vendorId = req.user.id;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const allOrders = await RentalOrder.find(filter);

    const activeRentals = allOrders.filter((o) =>
      ['confirmed', 'reserved', 'picked_up'].includes(o.status)
    ).length;

    const rentalsDueToday = allOrders.filter((o) => {
      if (!o.rentalPeriod?.end) return false;
      const d = new Date(o.rentalPeriod.end);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const upcomingPickups = allOrders.filter((o) => {
      if (!o.rentalPeriod?.start) return false;
      const d = new Date(o.rentalPeriod.start);
      return d >= todayStart;
    }).length;

    const upcomingReturns = allOrders.filter((o) => {
      if (!o.rentalPeriod?.end) return false;
      const d = new Date(o.rentalPeriod.end);
      return d > todayEnd;
    }).length;

    const overdueRentals = allOrders.filter((o) =>
      ['late_return', 'late_pickup'].includes(o.status) ||
      (o.status === 'picked_up' && o.rentalPeriod?.end && new Date(o.rentalPeriod.end) < new Date())
    ).length;

    // Revenue calculation
    const revenueFromRentals = allOrders
      .filter((o) => o.status !== 'cancelled' && o.status !== 'quotation')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Security Deposits Held
    const securityDepositsHeld = allOrders
      .filter((o) => o.securityDeposit?.status === 'held')
      .reduce((sum, o) => sum + (o.securityDeposit?.amount || 0), 0);

    // Late Fee Collection
    const lateFeeCollection = allOrders.reduce(
      (sum, o) => sum + (o.securityDeposit?.deductedAmount || o.lateFeeCalculated || 0),
      0
    );

    // Last 7 Days vs Previous 7 Days Sales Figure & % Change
    const current7DaysSales = allOrders
      .filter((o) => o.createdAt >= sevenDaysAgo && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const prev7DaysSales = allOrders
      .filter((o) => o.createdAt >= fourteenDaysAgo && o.createdAt < sevenDaysAgo && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const salesPercentageChange = prev7DaysSales === 0
      ? 100
      : Math.round(((current7DaysSales - prev7DaysSales) / prev7DaysSales) * 100);

    res.json({
      activeRentals,
      rentalsDueToday,
      upcomingPickups,
      upcomingReturns,
      overdueRentals,
      revenueFromRentals,
      securityDepositsHeld,
      lateFeeCollection,
      quickCounts: {
        today: rentalsDueToday,
        late: overdueRentals,
        pickup: upcomingPickups,
      },
      last7DaysSales: {
        amount: current7DaysSales,
        percentageChange: salesPercentageChange,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard KPIs', error: (error as Error).message });
  }
};

export const getSchedulerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;
    const currentYear = Number(year) || new Date().getFullYear();
    const currentMonth = Number(month) !== undefined ? Number(month) : new Date().getMonth();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const filter: any = {
      'rentalPeriod.start': { $lte: endOfMonth },
      'rentalPeriod.end': { $gte: startOfMonth },
    };

    if (req.user?.role === 'vendor') {
      filter.vendorId = req.user.id;
    }

    const orders = await RentalOrder.find(filter);

    // Map bookings to daily schedule slots
    const bookings = orders.map((o) => {
      let tag: 'Pick up' | 'Late Pick up' | 'Booked' | 'Late Delivery' | 'Available' = 'Booked';
      const now = new Date();

      if (o.status === 'quotation' || o.status === 'quotation_sent') {
        tag = 'Available';
      } else if (o.status === 'late_pickup') {
        tag = 'Late Pick up';
      } else if (o.status === 'late_return') {
        tag = 'Late Delivery';
      } else if (o.status === 'confirmed' || o.status === 'reserved') {
        if (o.rentalPeriod.start && new Date(o.rentalPeriod.start) <= now && !o.pickupDate) {
          tag = 'Late Pick up';
        } else {
          tag = 'Pick up';
        }
      } else if (o.status === 'picked_up') {
        if (o.rentalPeriod.end && new Date(o.rentalPeriod.end) < now) {
          tag = 'Late Delivery';
        } else {
          tag = 'Booked';
        }
      }

      const prodName = o.lines && o.lines[0] ? o.lines[0].productName : 'Rental Item';
      const qty = o.lines && o.lines[0] ? o.lines[0].quantity : 1;

      return {
        id: o._id,
        orderRef: o.orderRef,
        customerName: o.customerName,
        productName: prodName,
        quantity: qty,
        unit: o.lines && o.lines[0] ? o.lines[0].unit : 'Unit',
        startDate: o.rentalPeriod.start,
        endDate: o.rentalPeriod.end,
        status: o.status,
        tag,
        displayLabel: `${o.orderRef}: ${prodName}, ${o.customerName}, ${qty} Unit (${tag})`,
      };
    });

    res.json({
      month: currentMonth,
      year: currentYear,
      today: new Date().toISOString(),
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scheduler bookings', error: (error as Error).message });
  }
};
