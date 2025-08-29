(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/install.sh b/install.sh
--- a/install.sh
+++ b/install.sh
@@ -0,0 +1,303 @@
+#!/bin/bash
+
+echo "🚀 شروع نصب Music Platform..."
+echo "================================"
+
+# رنگ‌ها برای نمایش بهتر
+RED='\033[0;31m'
+GREEN='\033[0;32m'
+YELLOW='\033[1;33m'
+BLUE='\033[0;34m'
+NC='\033[0m' # No Color
+
+# تابع نمایش پیام
+print_status() {
+    echo -e "${BLUE}[INFO]${NC} $1"
+}
+
+print_success() {
+    echo -e "${GREEN}[SUCCESS]${NC} $1"
+}
+
+print_warning() {
+    echo -e "${YELLOW}[WARNING]${NC} $1"
+}
+
+print_error() {
+    echo -e "${RED}[ERROR]${NC} $1"
+}
+
+# بررسی root بودن
+if [ "$EUID" -ne 0 ]; then
+    print_error "این اسکریپت باید با دسترسی root اجرا شود"
+    exit 1
+fi
+
+# مرحله ۱: به‌روزرسانی سیستم
+print_status "مرحله ۱: به‌روزرسانی سیستم..."
+apt update && apt upgrade -y
+print_success "سیستم به‌روزرسانی شد"
+
+# مرحله ۲: نصب پیش‌نیازها
+print_status "مرحله ۲: نصب پیش‌نیازها..."
+apt install -y python3 python3-pip python3-venv curl wget git unzip
+print_success "پیش‌نیازها نصب شدند"
+
+# مرحله ۳: نصب Node.js
+print_status "مرحله ۳: نصب Node.js..."
+curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
+apt install -y nodejs
+print_success "Node.js نصب شد"
+
+# مرحله ۴: نصب PostgreSQL
+print_status "مرحله ۴: نصب PostgreSQL..."
+apt install -y postgresql postgresql-contrib
+print_success "PostgreSQL نصب شد"
+
+# مرحله ۵: نصب Redis
+print_status "مرحله ۵: نصب Redis..."
+apt install -y redis-server
+print_success "Redis نصب شد"
+
+# مرحله ۶: نصب Nginx
+print_status "مرحله ۶: نصب Nginx..."
+apt install -y nginx
+print_success "Nginx نصب شد"
+
+# مرحله ۷: راه‌اندازی PostgreSQL
+print_status "مرحله ۷: راه‌اندازی PostgreSQL..."
+systemctl start postgresql
+systemctl enable postgresql
+sudo -u postgres createdb music_platform 2>/dev/null || print_warning "دیتابیس music_platform قبلاً وجود دارد"
+sudo -u postgres createuser --superuser music_user 2>/dev/null || print_warning "کاربر music_user قبلاً وجود دارد"
+sudo -u postgres psql -c "ALTER USER music_user PASSWORD 'music123';" 2>/dev/null
+print_success "PostgreSQL راه‌اندازی شد"
+
+# مرحله ۸: راه‌اندازی Redis
+print_status "مرحله ۸: راه‌اندازی Redis..."
+systemctl start redis-server
+systemctl enable redis-server
+print_success "Redis راه‌اندازی شد"
+
+# مرحله ۹: ایجاد پوشه پروژه
+print_status "مرحله ۹: ایجاد پوشه پروژه..."
+mkdir -p /var/www/music-platform
+cd /var/www/music-platform
+print_success "پوشه پروژه ایجاد شد"
+
+# مرحله ۱۰: راه‌اندازی Backend (Django)
+print_status "مرحله ۱۰: راه‌اندازی Backend (Django)..."
+mkdir -p backend
+cd backend
+
+# ایجاد محیط مجازی
+python3 -m venv venv
+source venv/bin/activate
+
+# نصب پکیج‌های Python
+pip install --upgrade pip
+pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv djangorestframework-simplejwt celery redis boto3 Pillow pydub
+
+# ایجاد پروژه Django
+django-admin startproject core .
+python manage.py startapp api
+
+print_success "Backend Django ایجاد شد"
+
+# مرحله ۱۱: ایجاد فایل‌های Django
+print_status "مرحله ۱۱: ایجاد فایل‌های Django..."
+
+# ایجاد requirements.txt
+cat > requirements.txt << 'EOF'
+Django==5.2.5
+djangorestframework==3.16.1
+psycopg2-binary==2.9.10
+django-cors-headers==4.7.0
+python-dotenv==1.1.1
+djangorestframework-simplejwt==5.5.1
+celery==5.3.4
+redis==5.0.1
+boto3==1.34.0
+Pillow==10.1.0
+pydub==0.25.1
+EOF
+
+# ایجاد .env
+cat > .env << 'EOF'
+DEBUG=True
+SECRET_KEY=your-secret-key-here-change-in-production
+DATABASE_URL=postgresql://music_user:music123@localhost:5432/music_platform
+ALLOWED_HOSTS=45.159.248.253,localhost,127.0.0.1
+CORS_ALLOWED_ORIGINS=http://45.159.248.253,http://localhost:5173,http://127.0.0.1:5173
+
+# Redis Configuration
+REDIS_URL=redis://localhost:6379/0
+
+# AWS S3 Configuration (for file storage)
+AWS_ACCESS_KEY_ID=your-access-key
+AWS_SECRET_ACCESS_KEY=your-secret-key
+AWS_STORAGE_BUCKET_NAME=your-bucket-name
+AWS_S3_REGION_NAME=us-east-1
+AWS_S3_CUSTOM_DOMAIN=your-bucket-name.s3.amazonaws.com
+EOF
+
+# ایجاد celery.py
+cat > core/celery.py << 'EOF'
+import os
+from celery import Celery
+
+os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
+
+app = Celery('core')
+app.config_from_object('django.conf:settings', namespace='CELERY')
+app.autodiscover_tasks()
+
+@app.task(bind=True)
+def debug_task(self):
+    print(f'Request: {self.request!r}')
+EOF
+
+print_success "فایل‌های Django ایجاد شدند"
+
+# مرحله ۱۲: راه‌اندازی Frontend (React)
+print_status "مرحله ۱۲: راه‌اندازی Frontend (React)..."
+cd ..
+mkdir -p frontend
+cd frontend
+
+# ایجاد پروژه React
+npm create vite@latest . -- --template react-ts --yes
+npm install
+npm install axios react-router-dom zustand
+
+print_success "Frontend React ایجاد شد"
+
+# مرحله ۱۳: پیکربندی Nginx
+print_status "مرحله ۱۳: پیکربندی Nginx..."
+
+cat > /etc/nginx/sites-available/music-platform << 'EOF'
+server {
+    listen 80;
+    server_name 45.159.248.253;
+
+    # Frontend
+    location / {
+        proxy_pass http://localhost:5173;
+        proxy_http_version 1.1;
+        proxy_set_header Upgrade $http_upgrade;
+        proxy_set_header Connection 'upgrade';
+        proxy_set_header Host $host;
+        proxy_cache_bypass $http_upgrade;
+    }
+
+    # Backend API
+    location /api/ {
+        proxy_pass http://localhost:8000;
+        proxy_set_header Host $host;
+        proxy_set_header X-Real-IP $remote_addr;
+    }
+}
+EOF
+
+# فعال‌سازی سایت
+ln -sf /etc/nginx/sites-available/music-platform /etc/nginx/sites-enabled/
+rm -f /etc/nginx/sites-enabled/default
+
+# تست Nginx
+nginx -t
+systemctl restart nginx
+
+print_success "Nginx پیکربندی شد"
+
+# مرحله ۱۴: ایجاد systemd service
+print_status "مرحله ۱۴: ایجاد systemd service..."
+
+cat > /etc/systemd/system/music-backend.service << 'EOF'
+[Unit]
+Description=Music Platform Django Backend
+After=network.target postgresql.service
+
+[Service]
+Type=simple
+User=root
+WorkingDirectory=/var/www/music-platform/backend
+Environment=PATH=/var/www/music-platform/backend/venv/bin
+ExecStart=/var/www/music-platform/backend/venv/bin/python manage.py runserver 0.0.0.0:8000
+Restart=always
+RestartSec=5
+
+[Install]
+WantedBy=multi-user.target
+EOF
+
+cat > /etc/systemd/system/music-frontend.service << 'EOF'
+[Unit]
+Description=Music Platform React Frontend
+After=network.target
+
+[Service]
+Type=simple
+User=root
+WorkingDirectory=/var/www/music-platform/frontend
+ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0 --port 5173
+Restart=always
+RestartSec=5
+
+[Install]
+WantedBy=multi-user.target
+EOF
+
+# فعال‌سازی سرویس‌ها
+systemctl daemon-reload
+systemctl enable music-backend
+systemctl enable music-frontend
+
+print_success "سرویس‌های systemd ایجاد شدند"
+
+# مرحله ۱۵: تست نهایی
+print_status "مرحله ۱۵: تست نهایی..."
+
+# راه‌اندازی سرویس‌ها
+systemctl start music-backend
+systemctl start music-frontend
+
+# صبر برای راه‌اندازی
+sleep 10
+
+# تست سرویس‌ها
+if curl -s http://localhost:8000 > /dev/null; then
+    print_success "Backend در حال اجرا است"
+else
+    print_warning "Backend هنوز راه‌اندازی نشده"
+fi
+
+if curl -s http://localhost:5173 > /dev/null; then
+    print_success "Frontend در حال اجرا است"
+else
+    print_warning "Frontend هنوز راه‌اندازی نشده"
+fi
+
+# نمایش اطلاعات نهایی
+echo ""
+echo "🎉 نصب Music Platform کامل شد!"
+echo "================================"
+echo "🌐 آدرس‌های دسترسی:"
+echo "   Frontend: http://45.159.248.253/"
+echo "   Backend API: http://45.159.248.253/api/"
+echo "   Admin Panel: http://45.159.248.253/admin/"
+echo ""
+echo "📁 مسیر پروژه: /var/www/music-platform"
+echo "🔧 مدیریت سرویس‌ها:"
+echo "   systemctl status music-backend"
+echo "   systemctl status music-frontend"
+echo ""
+echo "📝 نکات مهم:"
+echo "   ۱. رمز دیتابیس: music123"
+echo "   ۲. کاربر دیتابیس: music_user"
+echo "   ۳. نام دیتابیس: music_platform"
+echo ""
+echo "🚀 برای شروع:"
+echo "   cd /var/www/music-platform/backend"
+echo "   source venv/bin/activate"
+echo "   python manage.py createsuperuser"
+echo ""
EOF
)
