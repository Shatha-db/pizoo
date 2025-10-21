# ⚡ Quick Start Guide - دليل البدء السريع

## 🚀 للمطورين الجدد

### 1️⃣ التثبيت (5 دقائق)

```bash
# استنساخ المشروع
git clone https://github.com/Shatha-db/pizoo.git
cd pizoo

# تثبيت Frontend
cd frontend
yarn install

# تثبيت Backend
cd ../backend
pip install -r requirements.txt
```

### 2️⃣ إعداد قاعدة البيانات

```bash
# تشغيل MongoDB محلياً
mongod --dbpath /data/db

# أو استخدم MongoDB Atlas (موصى به)
# احصل على connection string من: mongodb.com/cloud/atlas
```

### 3️⃣ إعداد المتغيرات

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=pizoo_database
JWT_SECRET=your-super-secret-key-change-this
```

### 4️⃣ إضافة بيانات تجريبية

```bash
cd backend
python seed_demo_users.py
```

### 5️⃣ التشغيل

```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

**✅ التطبيق يعمل:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

---

## 📱 بناء تطبيق Android

### الطريقة السريعة:

```bash
cd frontend
yarn build
npx cap sync android
npx cap open android
```

ثم اضغط **▶️ Run** في Android Studio

### الطريقة التلقائية (GitHub Actions):

1. Push الكود إلى GitHub
2. اذهب إلى **Actions** → **Build Android APK**
3. اضغط **Run workflow**
4. انتظر 5-10 دقائق
5. حمّل APK من **Artifacts**

---

## 🧪 اختبار التطبيق

### حسابات تجريبية:

```
sarah@demo.com / demo123
ahmed@demo.com / demo123
layla@demo.com / demo123
```

### مسار الاختبار:

1. ✅ افتح http://localhost:3000
2. ✅ سجل دخول بحساب تجريبي
3. ✅ جرب السوايب
4. ✅ افتح المطابقات
5. ✅ أرسل رسالة
6. ✅ غير اللغة من الإعدادات

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "Cannot connect to MongoDB"
```bash
# تأكد من تشغيل MongoDB
brew services start mongodb-community
# أو
sudo systemctl start mongod
```

### المشكلة: "Port 3000 already in use"
```bash
# غير المنفذ أو أغلق التطبيق القديم
kill -9 $(lsof -t -i:3000)
```

### المشكلة: "Module not found"
```bash
# أعد التثبيت
cd frontend && rm -rf node_modules && yarn install
cd backend && pip install -r requirements.txt --force-reinstall
```

### المشكلة: "Build failed"
```bash
# نظف ثم أعد البناء
cd frontend
rm -rf build node_modules
yarn install
yarn build
```

---

## 📚 موارد إضافية

- 📖 [README الكامل](README.md)
- 🏗️ [هيكل المشروع](PROJECT_STRUCTURE.md)
- 🚀 [دليل النشر](DEPLOYMENT.md)
- 📱 [دليل Mobile](MOBILE_DEVELOPMENT_GUIDE.md)
- 🤝 [دليل المساهمة](CONTRIBUTING.md)
- 🔒 [سياسة الأمان](SECURITY.md)
- 📝 [سجل التغييرات](CHANGELOG.md)

---

## 💡 نصائح للإنتاجية

### VS Code Extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python
- REST Client

### مفاتيح مختصرة مفيدة:
- `Cmd/Ctrl + Shift + P` - Command Palette
- `Cmd/Ctrl + P` - Quick Open
- `Cmd/Ctrl + B` - Toggle Sidebar
- `Cmd/Ctrl + J` - Toggle Terminal

---

## 🎯 الخطوات التالية

1. ✅ اقرأ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
2. ✅ افهم [API endpoints](http://localhost:8001/docs)
3. ✅ جرب بناء ميزة بسيطة
4. ✅ اقرأ [CONTRIBUTING.md](CONTRIBUTING.md)
5. ✅ انضم إلى فريق التطوير

---

**مرحباً بك في Pizoo! 🎉**

نحن متحمسون لوجودك معنا. إذا كان لديك أي أسئلة:
- 💬 افتح Issue على GitHub
- 📧 أرسل email: dev@pizoo.com
- 🐦 تابعنا: @PizooApp

Happy Coding! 💜
