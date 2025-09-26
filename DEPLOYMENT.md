# Deployment Guide

This guide will help you deploy the Pre-Install Registration System to Vercel for free hosting.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to store your code
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free)
3. **Node.js**: Install Node.js 18+ on your local machine

## Step 1: Prepare Your Code

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   In the Vercel dashboard, go to Settings → Environment Variables and add:
   
   ```
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key-here
   ```
   
   **Important**: Generate strong, random secrets:
   ```bash
   # Generate JWT secret
   openssl rand -base64 32
   
   # Generate NextAuth secret
   openssl rand -base64 32
   ```

3. **Deploy**
   - Click "Deploy" in Vercel
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.vercel.app`

## Step 3: Post-Deployment Setup

1. **Access Your Application**
   - Registration form: `https://your-app-name.vercel.app`
   - Admin dashboard: `https://your-app-name.vercel.app/admin`

2. **Login to Admin Dashboard**
   - Username: `admin`
   - Password: `admin123`
   - **⚠️ Change these credentials immediately!**

3. **Test the Application**
   - Submit a test registration
   - Verify files upload correctly
   - Check admin dashboard shows the submission

## Step 4: Security Hardening

1. **Change Default Credentials**
   - Login to admin dashboard
   - Update admin password (you'll need to modify the database directly for now)
   - Consider adding a user management system

2. **Configure Custom Domain** (Optional)
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

3. **Enable HTTPS**
   - Vercel automatically provides HTTPS
   - Ensure all traffic redirects to HTTPS

## Step 5: Database Considerations

**Current Setup**: SQLite database (file-based)
- ✅ Works for small to medium traffic
- ✅ No additional costs
- ❌ Not suitable for high-traffic applications
- ❌ Data persists only on Vercel's serverless functions

**For Production Scale**:
Consider upgrading to:
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL-compatible)
- **Supabase** (PostgreSQL with real-time features)

## Monitoring and Maintenance

1. **Monitor Usage**
   - Check Vercel dashboard for usage statistics
   - Monitor function execution times
   - Watch for errors in logs

2. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Test after updates

3. **Backup Strategy**
   - Export registration data regularly
   - Consider automated backups
   - Test restore procedures

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Issues**
   - Ensure database initialization runs
   - Check file permissions
   - Verify SQLite compatibility

3. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Test with different file types

4. **Authentication Issues**
   - Verify JWT secrets are set correctly
   - Check cookie settings
   - Test in incognito mode

### Getting Help

1. **Check Logs**
   - Vercel Function Logs
   - Browser Developer Console
   - Network tab for API errors

2. **Common Solutions**
   - Redeploy the application
   - Clear browser cache
   - Check environment variables

## Cost Considerations

**Vercel Free Tier Includes**:
- 100GB bandwidth per month
- 100GB-hours of serverless function execution
- Unlimited static deployments
- Automatic HTTPS

**Potential Upgrades**:
- Pro plan ($20/month) for higher limits
- Database hosting (varies by provider)
- Custom domain (if not using Vercel's free subdomain)

## Security Checklist

- [ ] Changed default admin credentials
- [ ] Set strong JWT and NextAuth secrets
- [ ] Enabled HTTPS (automatic with Vercel)
- [ ] Configured proper CORS settings
- [ ] Set up file upload restrictions
- [ ] Implemented rate limiting
- [ ] Added input validation
- [ ] Configured security headers

## Support

For issues or questions:
1. Check the main README.md
2. Review Vercel documentation
3. Check GitHub issues
4. Contact your development team

---

**Congratulations!** Your Pre-Install Registration System is now live and ready to collect registrations from your distributors.
