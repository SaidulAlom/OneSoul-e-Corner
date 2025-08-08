# Deployment Guide - OneSoul eCorner

This guide will help you deploy the OneSoul eCorner application and resolve common build issues.

## 🚀 Quick Deployment Steps

### 1. Environment Variables Setup

Before deploying, ensure you have these environment variables set:

#### Required Variables
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
```

#### Optional Variables
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Database Setup

1. **MongoDB Atlas** (Recommended for production):
   - Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
   - Get your connection string
   - Add it to your environment variables

2. **Local MongoDB** (For development):
   - Install MongoDB locally
   - Use connection string: `mongodb://localhost:27017/onesoul-ecorner`

### 3. Deployment Platforms

## 🌐 Vercel Deployment

### Step 1: Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Step 3: Environment Variables in Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables

## 🌐 Netlify Deployment

### Step 1: Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

### Step 3: Environment Variables in Netlify
1. Go to your site dashboard
2. Navigate to Site settings → Environment variables
3. Add all required variables

## 🔧 Build Issue Resolution

### Common Build Errors

#### Error: "Failed to collect page data for /api/vlogs/[id]"

**Cause**: API routes are being statically generated during build time.

**Solution**: 
1. Ensure environment variables are set correctly
2. Check that API routes don't run database queries at build time
3. Verify MongoDB connection string is valid

#### Error: "MONGODB_URI environment variable is not set"

**Solution**:
1. Add `MONGODB_URI` to your environment variables
2. Ensure the connection string is correct
3. Test the connection locally first

#### Error: "Module not found"

**Solution**:
1. Run `npm install` to ensure all dependencies are installed
2. Check that all imports are correct
3. Verify file paths are correct

### Build Configuration

The `next.config.js` file has been configured to:
- Handle API routes properly
- Configure CORS headers
- Set up environment variables
- Disable static generation for API routes

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Development Server
```bash
npm run dev
```

## 🔍 Troubleshooting

### Build Fails on Netlify/Vercel

1. **Check Environment Variables**:
   - Ensure all required variables are set
   - Verify MongoDB connection string is correct
   - Check JWT secret is set

2. **Check Build Logs**:
   - Look for specific error messages
   - Check if dependencies are missing
   - Verify TypeScript compilation

3. **Test Locally First**:
   ```bash
   npm run build
   npm run start
   ```

### Database Connection Issues

1. **MongoDB Atlas**:
   - Ensure IP whitelist includes deployment platform
   - Check connection string format
   - Verify database user permissions

2. **Local MongoDB**:
   - Ensure MongoDB is running
   - Check port 27017 is available
   - Verify database exists

### API Routes Not Working

1. **Check CORS Configuration**:
   - Verify headers are set correctly
   - Check if requests include proper headers

2. **Check Authentication**:
   - Ensure JWT tokens are valid
   - Verify user permissions

3. **Check Database Models**:
   - Ensure models are imported correctly
   - Verify schema definitions

## 📊 Performance Optimization

### 1. Database Indexes
The models include proper indexes for better performance:
- Text search indexes
- Compound indexes for common queries
- Indexes for sorting and filtering

### 2. API Response Optimization
- Implement pagination for large datasets
- Use projection to limit returned fields
- Cache frequently accessed data

### 3. Image Optimization
- Use Next.js Image component
- Configure Cloudinary for image optimization
- Implement lazy loading

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit sensitive data to Git
- Use strong, unique secrets
- Rotate secrets regularly

### 2. API Security
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Implement proper CORS policies

### 3. Database Security
- Use connection pooling
- Implement proper access controls
- Regular security updates

## 📈 Monitoring and Analytics

### 1. Error Tracking
- Set up error monitoring (Sentry, LogRocket)
- Monitor API response times
- Track user interactions

### 2. Performance Monitoring
- Monitor database query performance
- Track page load times
- Monitor API endpoint usage

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: Look for specific error messages
2. **Test locally**: Ensure it works in development
3. **Verify environment**: Check all environment variables
4. **Check dependencies**: Ensure all packages are installed
5. **Review configuration**: Verify Next.js and database config

For additional support:
- Check the troubleshooting section in README.md
- Review the API documentation
- Open an issue on GitHub

## 🎉 Success Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database is connected and accessible
- [ ] API routes are working
- [ ] Authentication is functional
- [ ] File uploads work (if using Cloudinary)
- [ ] Admin panel is accessible
- [ ] Sample data is created
- [ ] Build completes successfully
- [ ] Site loads without errors
- [ ] All features are tested

Congratulations! Your OneSoul eCorner application should now be deployed and working properly.
