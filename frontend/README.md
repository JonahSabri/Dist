# Music Platform Frontend

A beautiful, modern glass-morphism frontend for the Music Platform built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 Design
- **Glass-morphism UI**: Modern, translucent design with backdrop blur effects
- **Green & Pink Gradients**: Beautiful color scheme with smooth transitions
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Smooth Animations**: CSS animations and hover effects for enhanced UX

### 🔐 Authentication
- **User Registration**: Artist and listener account creation
- **Login System**: Secure authentication with JWT tokens
- **Password Recovery**: Forgot password functionality
- **Protected Routes**: Role-based access control

### 🎵 Artist Dashboard
- **Music Upload**: Drag & drop audio file uploads
- **Track Management**: View and manage uploaded tracks
- **Status Tracking**: Monitor track approval and distribution status
- **Analytics**: View play counts and performance metrics

### 👑 Admin Dashboard
- **Track Review**: Review and approve pending music uploads
- **Status Updates**: Update track status, ISRC codes, and lyrics approval
- **Statistics**: View platform-wide metrics and analytics
- **User Management**: Monitor artist accounts and activity

### 🚀 Technical Features
- **TypeScript**: Full type safety and better development experience
- **State Management**: Zustand for lightweight state management
- **API Integration**: RESTful API integration with axios
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading animations and feedback

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardNav.tsx
│   ├── ErrorBoundary.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── ForgotPasswordPage.tsx # Password recovery
│   ├── ArtistDashboard.tsx # Artist dashboard
│   └── AdminDashboard.tsx # Admin dashboard
├── services/           # API services
│   └── api.ts         # API endpoints and configuration
├── store/             # State management
│   └── authStore.ts   # Authentication state
├── App.tsx            # Main app component with routing
└── main.tsx           # App entry point
```

## Color Palette

The design uses a custom color palette defined in `tailwind.config.js`:

- **Primary (Green)**: `#22c55e` - Main brand color
- **Secondary (Pink)**: `#ec4899` - Accent color
- **Glass Effects**: Translucent backgrounds with backdrop blur
- **Gradients**: Smooth transitions between primary and secondary colors

## API Integration

The frontend integrates with the Django backend through RESTful APIs:

- **Authentication**: JWT-based authentication system
- **Music Upload**: File upload with metadata
- **Track Management**: CRUD operations for music tracks
- **Admin Functions**: Track review and status management

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive breakpoints for tablet and desktop
- **Touch Friendly**: Optimized for touch interactions
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size

## Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Efficient image handling
- **Smooth Animations**: CSS-based animations for performance

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **ES6+ Features**: Modern JavaScript features
- **CSS Grid & Flexbox**: Modern CSS layout features
- **Backdrop Filter**: Glass-morphism effects (with fallbacks)

## Development

### Code Style
- **ESLint**: Code linting and formatting
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (if configured)

### Testing
- **Component Testing**: Test individual components
- **Integration Testing**: Test component interactions
- **E2E Testing**: End-to-end user journey testing

## Deployment

### Build Process
1. Run `npm run build` to create production build
2. Build files are generated in `dist/` directory
3. Deploy `dist/` contents to your web server

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information
