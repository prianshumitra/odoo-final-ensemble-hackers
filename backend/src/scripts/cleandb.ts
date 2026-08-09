import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function cleanDB() {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/diligent_wombat';
  await mongoose.connect(connStr);
  console.log('Connected to MongoDB');

  // Drop old collections that are no longer needed
  const collectionsToClean = ['products', 'rentalorders', 'rentals', 'invoices', 'payments', 'attributes', 'pricelists', 'quotationtemplates', 'settings', 'carts'];

  for (const name of collectionsToClean) {
    try {
      await mongoose.connection.db!.dropCollection(name);
      console.log(`🗑️ Dropped collection: ${name}`);
    } catch (err: any) {
      if (err.codeName === 'NamespaceNotFound') {
        console.log(`⏭️ Collection not found (already clean): ${name}`);
      } else {
        console.warn(`⚠️ Error dropping ${name}:`, err.message);
      }
    }
  }

  console.log('✅ Database cleaned! Run the server to re-seed fresh data.');
  await mongoose.disconnect();
  process.exit(0);
}

cleanDB();
