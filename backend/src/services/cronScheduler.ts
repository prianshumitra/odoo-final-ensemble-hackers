import cron from 'node-cron';
import { RentalOrder } from '../models/RentalOrder.js';
import { getIO } from '../socket.js';

export const initOverdueCronJob = () => {
  // Run every hour to flag overdue rentals
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running automated overdue rentals sweep...');
    try {
      const now = new Date();

      // 1. Flag late pickups: status 'confirmed' or 'reserved' where rentalPeriod.start has passed and pickupDate is missing
      const latePickups = await RentalOrder.find({
        status: { $in: ['confirmed', 'reserved'] },
        'rentalPeriod.start': { $lt: now },
        pickupDate: { $exists: false },
      });

      for (const order of latePickups) {
        order.status = 'late_pickup';
        await order.save();
        try {
          getIO().emit('order:updated', order);
        } catch (err) {}
      }

      // 2. Flag late returns: status 'picked_up' where rentalPeriod.end has passed
      const lateReturns = await RentalOrder.find({
        status: 'picked_up',
        'rentalPeriod.end': { $lt: now },
      });

      for (const order of lateReturns) {
        order.status = 'late_return';
        await order.save();
        try {
          getIO().emit('order:updated', order);
        } catch (err) {}
      }

      console.log(`✅ Overdue sweep completed: ${latePickups.length} late pickups, ${lateReturns.length} late returns updated.`);
    } catch (error) {
      console.error('Error running overdue cron job:', (error as Error).message);
    }
  });
};
