import connectDB from '../lib/database';
import User from '../lib/models/User';
import { hashPassword } from '../lib/auth';

async function initDB() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@onesoul.com' });
    
    if (!adminExists) {
      // Create admin user
      const hashedPassword = await hashPassword('admin123');
      const admin = new User({
        name: 'Admin',
        email: 'admin@onesoul.com',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDB(); 