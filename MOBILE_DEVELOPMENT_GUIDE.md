# 🚀 Pizoo Mobile App - دليل التطوير الشامل

## 📱 نظرة عامة

تم تحويل Pizoo إلى تطبيق موبايل كامل باستخدام:
- **Frontend:** React + Capacitor + Tailwind CSS
- **Backend:** FastAPI + MongoDB
- **Platforms:** Android & iOS
- **Languages:** 5 لغات (العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية)

---

## 🗂️ هيكل المشروع

```
/app
├── backend/                  # FastAPI Backend
│   ├── server.py            # Main API
│   ├── seed_demo_users.py   # Demo data
│   └── requirements.txt     
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── i18n/           # Internationalization
│   │   ├── locales/        # Translations
│   │   ├── pages/          # App pages
│   │   └── components/     # UI components
│   ├── android/            # Android native project
│   ├── ios/                # iOS native project (future)
│   ├── capacitor.config.ts # Capacitor config
│   └── build-android.sh    # Build script
└── .github/
    └── workflows/
        └── build-android.yml # GitHub Actions

```

---

## 🛠️ التثبيت والإعداد

### المتطلبات:
- Node.js 20+
- Java 17+
- Android Studio (للتطوير المحلي)
- Python 3.9+

### 1. تثبيت Dependencies:

```bash
# Frontend
cd frontend
yarn install

# Backend
cd backend
pip install -r requirements.txt
```

### 2. إعداد MongoDB:

يمكنك استخدام:
- **MongoDB Atlas** (الموصى به للإنتاج)
- **MongoDB محلي** (للتطوير)

**للإعداد:**
```bash
# تحديث backend/.env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=pizoo_database
```

---

## 🌍 دعم اللغات (i18n)

### اللغات المدعومة:
1. 🇬🇧 English
2. 🇸🇦 العربية (مع دعم RTL)
3. 🇪🇸 Español
4. 🇫🇷 Français
5. 🇩🇪 Deutsch

### إضافة لغة جديدة:

1. أنشئ ملف `/frontend/src/locales/[lang].json`
2. أضف الترجمات
3. حدّث `/frontend/src/i18n/config.js`:
```javascript
import newLang from '../locales/newlang.json';

const resources = {
  // ... existing
  newlang: { translation: newLang }
};
```

---

## 📱 بناء التطبيق

### طريقة 1: البناء المحلي

```bash
cd frontend
./build-android.sh
```

**النتيجة:** `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### طريقة 2: GitHub Actions (تلقائي)

1. ادفع الكود إلى GitHub
2. اذهب إلى **Actions** → **Build Android APK**
3. اضغط **Run workflow**
4. انتظر 5-10 دقائق
5. حمّل APK من **Artifacts**

---

## 🔧 التطوير المحلي

### تشغيل Frontend:
```bash
cd frontend
yarn start
```
**URL:** http://localhost:3000

### تشغيل Backend:
```bash
cd backend
uvicorn server:app --reload --port 8001
```
**URL:** http://localhost:8001

### اختبار على Android:

```bash
cd frontend
yarn build
npx cap sync android
npx cap open android
```

ثم اضغط **Run** في Android Studio.

---

## 🚀 النشر

### Frontend (Web):
- **Vercel:** تم النشر ✅
- **Netlify:** متوافق
- **Emergent Deploy:** 50 كريديت/شهر

### Backend:
- **Emergent:** موصى به
- **Render:** مجاني
- **Heroku:** $7/شهر
- **Railway:** مجاني

### Mobile:
- **Google Play Store:** يحتاج حساب مطور ($25 مرة واحدة)
- **Apple App Store:** يحتاج حساب مطور ($99/سنة)

---

## 🔐 متغيرات البيئة

### Frontend (.env):
```env
REACT_APP_BACKEND_URL=https://your-backend.com
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=false
```

### Backend (.env):
```env
MONGO_URL=mongodb+srv://...
DB_NAME=pizoo_database
JWT_SECRET=your-secret-key
CORS_ORIGINS=*
```

---

## 📦 Capacitor Plugins المثبتة

- `@capacitor/core` - Core functionality
- `@capacitor/android` - Android platform
- `@capacitor/ios` - iOS platform
- `@capacitor/camera` - Camera access
- `@capacitor/geolocation` - Location services
- `@capacitor/push-notifications` - Push notifications
- `@capacitor/splash-screen` - Splash screen
- `@capacitor/app` - App lifecycle
- `@capacitor/status-bar` - Status bar styling

---

## 🐛 استكشاف الأخطاء

### خطأ: "Could not find GradleWrapperMain"
**الحل:**
```bash
cd frontend/android
./gradlew wrapper --gradle-version 8.0
```

### خطأ: "Node version mismatch"
**الحل:**
```bash
nvm use 20
# أو
nvm install 20
nvm use 20
```

### خطأ: "TypeScript not found"
**الحل:**
```bash
cd frontend
yarn add -D typescript
```

---

## 📊 الميزات المطبقة

### ✅ جاهز:
- [x] Web App كامل
- [x] دعم 5 لغات
- [x] Capacitor مُعد
- [x] Android project جاهز
- [x] GitHub Actions workflow
- [x] Build scripts
- [x] i18n مع RTL

### 🔄 قيد التطوير:
- [ ] iOS project
- [ ] Push notifications
- [ ] Camera integration
- [ ] Geolocation features
- [ ] App Store submission

---

## 👥 الحسابات التجريبية

```
sarah@demo.com / demo123
ahmed@demo.com / demo123
layla@demo.com / demo123
omar@demo.com / demo123
mira@demo.com / demo123
```

---

## 🔗 روابط مفيدة

- [Capacitor Docs](https://capacitorjs.com/docs)
- [React i18next](https://react.i18next.com/)
- [Android Studio](https://developer.android.com/studio)
- [GitHub Actions](https://docs.github.com/actions)

---

## 📝 الخطوات التالية

1. ✅ **اختبر Web App** على Vercel
2. ✅ **ادفع إلى GitHub** لتفعيل GitHub Actions
3. ⏳ **انتظر بناء APK** (5-10 دقائق)
4. 📥 **حمّل APK** من Artifacts
5. 📱 **اختبر على Android**
6. 🚀 **انشر على Play Store**

---

© 2025 Pizoo. جميع الحقوق محفوظة.
