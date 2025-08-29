# Music Platform - پلتفرم پخش و توزیع موسیقی

یک پلتفرم کامل پخش و توزیع موسیقی مشابه DistroKid که با استفاده از تکنولوژی‌های مدرن ساخته شده است.

## 🚀 ویژگی‌ها

- **سیستم احراز هویت کامل** با JWT
- **پنل هنرمند** برای آپلود و مدیریت موسیقی
- **پخش‌کننده موسیقی** با کیفیت بالا
- **سیستم جستجو و فیلتر** پیشرفته
- **مدیریت آلبوم و ترک** کامل
- **پردازش خودکار فایل‌های صوتی** با Celery
- **ذخیره‌سازی ابری** سازگار با S3

## 🛠️ تکنولوژی‌های استفاده شده

### Backend
- **Python 3.10+**
- **Django 5.2.5**
- **Django REST Framework 3.16.1**
- **PostgreSQL** (SQLite برای توسعه)
- **Celery** برای وظایف پس‌زمینه
- **Redis** برای کش و صف
- **JWT** برای احراز هویت

### Frontend
- **React 18** با TypeScript
- **Vite** برای build و development
- **Tailwind CSS** برای styling
- **Zustand** برای مدیریت state
- **React Router** برای routing
- **Axios** برای HTTP requests

## 📁 ساختار پروژه

```
music-platform/
├── core/                 # پروژه اصلی Django
│   ├── settings.py      # تنظیمات پروژه
│   ├── urls.py         # URL های اصلی
│   └── celery.py       # تنظیمات Celery
├── api/                 # اپ API
│   ├── models.py       # مدل‌های دیتابیس
│   ├── views.py        # View های API
│   ├── serializers.py  # Serializer ها
│   └── urls.py         # URL های API
├── frontend/            # اپ React
│   ├── src/
│   │   ├── components/ # کامپوننت‌های React
│   │   ├── pages/      # صفحات اصلی
│   │   ├── services/   # سرویس‌های API
│   │   ├── store/      # Zustand stores
│   │   └── hooks/      # Custom hooks
│   └── package.json
├── requirements.txt     # پکیج‌های Python
└── .env                # متغیرهای محیطی
```

## 🚀 راه‌اندازی

### پیش‌نیازها
- Python 3.10+
- Node.js 18+
- PostgreSQL (اختیاری - SQLite برای توسعه)
- Redis (برای Celery)

### Backend

1. **ایجاد محیط مجازی:**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# یا
venv\Scripts\activate     # Windows
```

2. **نصب پکیج‌ها:**
```bash
pip install -r requirements.txt
```

3. **تنظیم متغیرهای محیطی:**
فایل `.env` را ایجاد کرده و مقادیر مناسب را تنظیم کنید.

4. **اجرای مایگریشن‌ها:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **راه‌اندازی سرور:**
```bash
python manage.py runserver
```

### Frontend

1. **نصب پکیج‌ها:**
```bash
cd frontend
npm install
```

2. **راه‌اندازی سرور توسعه:**
```bash
npm run dev
```

## 📋 نقشه راه توسعه

### ✅ فاز ۱: راه‌اندازی اولیه
- [x] راه‌اندازی پروژه Django
- [x] راه‌اندازی پروژه React
- [x] اتصال Backend و Frontend
- [x] API Health Check

### 🔄 فاز ۲: سیستم احراز هویت
- [ ] مدل‌های User و Profile
- [ ] API های ثبت‌نام و ورود
- [ ] پیاده‌سازی JWT
- [ ] کامپوننت‌های احراز هویت

### ⏳ فاز ۳: پنل هنرمند
- [ ] مدل‌های Artist, Album, Track
- [ ] راه‌اندازی Celery و Redis
- [ ] API آپلود موسیقی
- [ ] پردازش خودکار فایل‌ها

### ⏳ فاز ۴: بخش عمومی
- [ ] API های عمومی
- [ ] صفحات عمومی
- [ ] پلیر موسیقی سراسری

## 🌐 API Endpoints

### عمومی
- `GET /api/health/` - بررسی وضعیت API

### احراز هویت
- `POST /api/auth/register/` - ثبت‌نام کاربر
- `POST /api/auth/token/` - ورود و دریافت توکن
- `POST /api/auth/token/refresh/` - تازه‌سازی توکن
- `GET /api/users/me/` - اطلاعات کاربر فعلی

### هنرمند
- `POST /api/artist/tracks/` - آپلود آهنگ جدید

## 🤝 مشارکت

برای مشارکت در پروژه:

1. پروژه را fork کنید
2. یک branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. به branch اصلی push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request ایجاد کنید

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر فایل `LICENSE` را مطالعه کنید.

## 📞 پشتیبانی

برای سوالات و مشکلات:
- یک Issue در GitHub ایجاد کنید
- با تیم توسعه تماس بگیرید

---

**توسعه داده شده با ❤️ برای جامعه موسیقی**