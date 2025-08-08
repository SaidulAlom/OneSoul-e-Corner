const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set. Please configure your database connection.');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// News Schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  salary: { type: String },
  applicationEmail: { type: String },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Vlog Schema
const vlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// EBook Schema
const ebookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const UserModel = mongoose.model('User', userSchema);
const NewsModel = mongoose.model('News', newsSchema);
const JobModel = mongoose.model('Job', jobSchema);
const VlogModel = mongoose.model('Vlog', vlogSchema);
const EBookModel = mongoose.model('EBook', ebookSchema);

async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Create admin user if it doesn't exist
    const adminExists = await UserModel.findOne({ email: 'admin@onesoul.com' });
    if (!adminExists) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await hashPassword('admin123');
      await UserModel.create({
        name: 'Admin User',
        email: 'admin@onesoul.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@onesoul.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample data if collections are empty
    const newsCount = await NewsModel.countDocuments();
    if (newsCount === 0) {
      console.log('📰 Creating sample news...');
      const adminUser = await UserModel.findOne({ role: 'admin' });
      await NewsModel.create({
        title: 'Welcome to OneSoul eCorner',
        content: 'This is a sample news article to get you started. You can edit or delete this article from the admin panel.',
        excerpt: 'Welcome to our platform! This is a sample news article.',
        category: 'technology',
        author: adminUser._id,
        published: true,
        featured: true,
        tags: ['welcome', 'sample']
      });
      console.log('✅ Sample news created');
    }

    const jobsCount = await JobModel.countDocuments();
    if (jobsCount === 0) {
      console.log('💼 Creating sample job...');
      await JobModel.create({
        title: 'Sample Job Position',
        company: 'OneSoul eCorner',
        location: 'Remote',
        type: 'full-time',
        category: 'technology',
        description: 'This is a sample job posting. You can edit or delete this job from the admin panel.',
        requirements: 'Sample requirements for the job position.',
        salary: '$50,000 - $70,000',
        applicationEmail: 'jobs@onesoul.com',
        active: true,
        featured: true
      });
      console.log('✅ Sample job created');
    }

    const vlogsCount = await VlogModel.countDocuments();
    if (vlogsCount === 0) {
      console.log('🎥 Creating sample vlog...');
      const adminUser = await UserModel.findOne({ role: 'admin' });
      await VlogModel.create({
        title: 'Sample Vlog',
        description: 'This is a sample vlog entry. You can edit or delete this vlog from the admin panel.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'technology',
        author: adminUser._id,
        published: true,
        featured: true,
        tags: ['sample', 'vlog']
      });
      console.log('✅ Sample vlog created');
    }

    const ebooksCount = await EBookModel.countDocuments();
    if (ebooksCount === 0) {
      console.log('📚 Creating sample ebook...');
      await EBookModel.create({
        title: 'Sample E-Book',
        author: 'Sample Author',
        description: 'This is a sample e-book. You can edit or delete this ebook from the admin panel.',
        category: 'technology',
        price: 0,
        available: true,
        featured: true,
        tags: ['sample', 'ebook']
      });
      console.log('✅ Sample ebook created');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Login with admin@onesoul.com / admin123');
    console.log('3. Access the admin panel to manage content');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase().then(() => {
  console.log('🏁 Initialization script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Initialization script failed:', error);
  process.exit(1);
});
