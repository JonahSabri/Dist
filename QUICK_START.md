# 🚀 Quick Start Guide - Music Platform

Get the Music Platform up and running in minutes!

## ⚡ Super Quick Start

### Option 1: Automated Startup (Recommended)
```bash
# Make sure you're in the project root directory
chmod +x start.sh
./start.sh
```

This will automatically:
- ✅ Check prerequisites
- ✅ Set up the database
- ✅ Start both backend and frontend servers
- ✅ Open the platform in your browser

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python setup.py

# Start server
python manage.py runserver
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

Once everything is running:

- **🎨 Frontend**: http://localhost:5173
- **🔧 Backend API**: http://localhost:8000/api
- **👑 Admin Panel**: http://localhost:8000/admin
- **🔍 Health Check**: http://localhost:8000/api/health/

## 🔐 Default Admin Account

After running `python setup.py`:

- **Email**: admin@musicplatform.com
- **Password**: admin123

## 📱 What You Can Do

### As an Artist:
1. **Register** at http://localhost:5173/register
2. **Login** to your dashboard
3. **Upload music** with metadata
4. **Track status** of your uploads
5. **View analytics** and play counts

### As an Admin:
1. **Login** to admin panel
2. **Review tracks** pending approval
3. **Assign ISRC codes**
4. **Update track status**
5. **Monitor platform statistics**

## 🧪 Test the API

Run the demo script to test all endpoints:
```bash
python demo.py
```

## 🛠️ Troubleshooting

### Common Issues:

**Backend won't start:**
- Check if port 8000 is free
- Ensure Python 3.8+ is installed
- Verify all dependencies are installed

**Frontend won't start:**
- Check if port 5173 is free
- Ensure Node.js 18+ is installed
- Verify npm dependencies are installed

**Database errors:**
- Run `python setup.py` to recreate database
- Check if `db.sqlite3` file exists

**CORS errors:**
- Ensure backend is running on port 8000
- Check CORS settings in `core/settings.py`

### Reset Everything:
```bash
# Remove database and recreate
rm db.sqlite3
python setup.py

# Restart servers
./start.sh
```

## 📚 Next Steps

1. **Explore the UI** - Navigate through different pages
2. **Upload test music** - Try the music upload feature
3. **Test admin functions** - Review and approve tracks
4. **Customize the design** - Modify colors and styles in `frontend/tailwind.config.js`
5. **Add features** - Extend the platform with new functionality

## 🎯 Key Features to Try

- ✨ **Glass-morphism design** with green/pink gradients
- 🔐 **User authentication** and role-based access
- 🎵 **Music upload** with metadata
- 📊 **Status tracking** and analytics
- 👑 **Admin dashboard** for content management
- 📱 **Responsive design** for all devices

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the [frontend README](frontend/README.md) for frontend-specific info
- Run `python demo.py` to test API functionality
- Check server logs for error messages

---

**🎉 You're all set! Enjoy building with the Music Platform!**