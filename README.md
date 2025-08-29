# 🎵 Music Platform

A comprehensive music distribution platform built with Django and React, featuring beautiful glass-morphism design with green and pink gradients.

## ✨ Features

### 🎨 Frontend
- **Glass-morphism UI**: Modern, translucent design with backdrop blur effects
- **Green & Pink Gradients**: Beautiful color scheme with smooth transitions
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Artist Dashboard**: Music upload, track management, and status tracking
- **Admin Dashboard**: Track review, status updates, and platform analytics
- **Authentication**: Secure login, registration, and password recovery

### 🔧 Backend
- **Django REST API**: Robust backend with JWT authentication
- **Custom User Model**: Support for artists, listeners, and admins
- **Music Management**: Track upload, metadata handling, and file storage
- **Admin Functions**: Track review, ISRC assignment, and status management
- **Notifications**: Real-time updates for track status changes
- **Analytics**: Play tracking and user engagement metrics

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### Backend
- **Django 5.2** - High-level Python web framework
- **Django REST Framework** - Powerful API toolkit
- **Django Simple JWT** - JWT authentication
- **SQLite** - Lightweight database (easily switchable to PostgreSQL)
- **Pillow** - Image processing
- **CORS Headers** - Cross-origin resource sharing

## 📁 Project Structure

```
music-platform/
├── api/                    # Django API app
│   ├── models.py          # Database models
│   ├── views.py           # API endpoints
│   ├── serializers.py     # Data serialization
│   ├── admin.py           # Django admin
│   └── urls.py            # API routing
├── core/                   # Django project settings
│   ├── settings.py        # Project configuration
│   └── urls.py            # Main URL routing
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── App.tsx        # Main app component
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── setup.py               # Project setup script
└── README.md              # This file
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd music-platform
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run setup script:**
   ```bash
   python setup.py
   ```

5. **Start the backend server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Health Check**: http://localhost:8000/api/health/

## 🔐 Default Credentials

After running the setup script:

- **Admin User**: admin@musicplatform.com
- **Password**: admin123

## 📱 User Flows

### Artist Journey
1. **Registration**: Artist creates account with email and display name
2. **Login**: Artist accesses their dashboard
3. **Upload Music**: Artist uploads audio files with metadata
4. **Track Status**: Artist monitors track approval and distribution status
5. **Analytics**: Artist views play counts and performance metrics

### Admin Journey
1. **Login**: Admin accesses admin dashboard
2. **Track Review**: Admin reviews pending music uploads
3. **Status Updates**: Admin approves/rejects tracks and assigns ISRC codes
4. **Lyrics Review**: Admin reviews and approves lyrics content
5. **Platform Analytics**: Admin views overall platform statistics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/forgot-password/` - Password recovery

### Music Management
- `POST /api/music/upload/` - Upload music track
- `GET /api/music/artist-tracks/` - Get artist's tracks
- `GET /api/music/tracks/{id}/` - Get track details
- `PUT /api/music/tracks/{id}/update/` - Update track
- `DELETE /api/music/tracks/{id}/delete/` - Delete track

### Admin Functions
- `GET /api/admin/pending-tracks/` - Get tracks for review
- `GET /api/admin/all-tracks/` - Get all tracks
- `PUT /api/admin/tracks/{id}/status/` - Update track status
- `GET /api/admin/stats/` - Get platform statistics
- `GET /api/admin/artists/` - Get artist list

### User Profile
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/update/` - Update profile
- `GET /api/users/notifications/` - Get user notifications

## 🎨 Design System

### Color Palette
- **Primary (Green)**: `#22c55e` - Main brand color
- **Secondary (Pink)**: `#ec4899` - Accent color
- **Glass Effects**: Translucent backgrounds with backdrop blur
- **Gradients**: Smooth transitions between primary and secondary colors

### Components
- **Glass Cards**: Translucent containers with backdrop blur
- **Gradient Buttons**: Smooth color transitions on interactive elements
- **Floating Elements**: Subtle animations for visual interest
- **Responsive Grids**: Flexible layouts that adapt to screen size

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production settings
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure environment variables
5. Use Gunicorn or uWSGI for production server

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy `dist/` directory to web server
3. Configure reverse proxy for API calls
4. Set up HTTPS certificates

## 🧪 Testing

### Backend Testing
```bash
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📊 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Efficient image handling
- **Caching**: API response caching
- **Database Optimization**: Efficient queries and indexing

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Controlled cross-origin access
- **Input Validation**: Comprehensive data validation
- **Permission System**: Role-based access control
- **File Upload Security**: Secure file handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Music streaming capabilities
- [ ] Social features (following, playlists)
- [ ] Mobile app development
- [ ] AI-powered music recommendations
- [ ] Integration with music distribution services
- [ ] Advanced admin tools
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

---

**Built with ❤️ using Django and React**