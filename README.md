# Pre-Install Registration System

A secure web application for managing pre-install registrations for traffic signal installations. This system allows distributors to collect installation details from cities and provides a secure admin interface for viewing submissions.

## Features

### Public Registration Form
- **Intersection Information**: Name and end user details
- **Technical Specifications**: 
  - Distributor selection (dropdown with "Other" option)
  - Cabinet type (dropdown with "Other" option)
  - TLS connection type (dropdown with "Other" option)
  - Detection I/O configuration (dropdown with "Other" option)
- **Documentation Upload**:
  - Phasing information (text and/or file upload)
  - Timing files (multiple file upload support)
- **Contact Information**: Name, email, and phone number
- **Form Validation**: Client-side and server-side validation
- **Responsive Design**: Works on desktop and mobile devices

### Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Registration Management**: View all submitted registrations
- **Detailed View**: Complete registration details in modal
- **Statistics**: Registration counts and trends
- **Export Capabilities**: View and manage all submissions

### Security Features
- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries
- **File Upload Security**: Type and size validation
- **HTTPS Ready**: Secure cookie configuration

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Deployment**: Vercel (free hosting)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pre-install-registration-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update the following:
   - `JWT_SECRET`: Generate a secure random string
   - `NEXTAUTH_SECRET`: Generate another secure random string

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Registration form: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**⚠️ Important**: Change these credentials immediately after first login in production!

## Deployment (Vercel - Free)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `JWT_SECRET`: Your secure JWT secret
     - `NEXTAUTH_SECRET`: Your NextAuth secret
   - Deploy!

3. **Configure Database**
   - The SQLite database will be created automatically
   - Default admin user will be created on first run
   - For production, consider upgrading to a managed database

## File Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── registrations/  # Registration management
│   │   └── dropdown-data/  # Dropdown options
│   ├── admin/              # Admin dashboard
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Registration form
├── components/
│   ├── AdminDashboard.tsx  # Admin interface
│   ├── AdminLogin.tsx      # Login form
│   └── RegistrationForm.tsx # Main form
├── lib/
│   ├── auth.ts             # Authentication utilities
│   └── database.ts         # Database configuration
├── types/
│   └── index.ts            # TypeScript definitions
└── uploads/                # File upload directory
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify authentication token

### Registrations
- `POST /api/registrations` - Create new registration
- `GET /api/registrations` - Get all registrations (admin only)

### Data
- `GET /api/dropdown-data` - Get dropdown options

## Security Considerations

1. **Change Default Credentials**: Update admin username/password
2. **Use Strong Secrets**: Generate secure JWT and NextAuth secrets
3. **Enable HTTPS**: Ensure SSL/TLS in production
4. **Regular Updates**: Keep dependencies updated
5. **File Upload Limits**: Configure appropriate file size limits
6. **Database Security**: Consider using managed database for production

## Customization

### Adding New Dropdown Options
Edit the database initialization in `lib/database.ts`:

```typescript
// Add new distributors
const distributors = ['Distributor A', 'Distributor B', 'New Distributor'];

// Add new cabinet types
const cabinetTypes = ['Type A', 'Type B', 'New Type'];
```

### Styling
Modify `tailwind.config.js` and `app/globals.css` for custom styling.

### Form Fields
Update `RegistrationSchema` in `lib/database.ts` and the form component accordingly.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check database file permissions

## License

This project is proprietary software. All rights reserved.
