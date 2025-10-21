# Pizoo Dating App 💜

تطبيق تعارف مشابه لـ Badoo مبني بـ React + FastAPI + MongoDB

## 🚀 النشر على Vercel

### الخطوات:

1. **تأكد من أن Repository عام (Public)** ✅
   
2. **قم باستيراد المشروع إلى Vercel:**
   - افتح [vercel.com/new](https://vercel.com/new)
   - اختر "Import Git Repository"
   - اختر repository: `Shatha-db/pizoo`

3. **إعدادات Build:**
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** `cd frontend && yarn install && yarn build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `cd frontend && yarn install`

4. **متغيرات البيئة (Environment Variables):**
   أضف المتغيرات التالية في Vercel:
   ```
   REACT_APP_BACKEND_URL=<your-backend-url>
   DISABLE_ESLINT_PLUGIN=true
   GENERATE_SOURCEMAP=false
   ```

5. **اضغط Deploy!**

## 📱 الميزات

- ✅ صفحة Encounters (عرض Grid)
- ✅ نظام السوايب (Swipe)
- ✅ المطابقات (Matches)
- ✅ الدردشة المباشرة
- ✅ "من أعجب بك"
- ✅ نظام الإشعارات
- ✅ ملفات شخصية تفصيلية
- ✅ علامات التحقق والاهتمامات
- ✅ حالة الاتصال (Online/Offline)

## 🎨 التصميم

- ألوان Badoo الأصلية (بنفسجي/وردي)
- واجهة عربية كاملة
- متجاوب مع جميع الأجهزة

## 👥 حسابات تجريبية

```
sarah@demo.com / demo123
ahmed@demo.com / demo123
layla@demo.com / demo123
omar@demo.com / demo123
mira@demo.com / demo123
```

## 🛠️ التطوير المحلي

```bash
# Frontend
cd frontend
yarn install
yarn start

# Backend
cd backend
pip install -r requirements.txt
python seed_demo_users.py
uvicorn server:app --reload --port 8001
```

## 📝 ملاحظات

- هذا تطبيق **Web App** (يعمل في المتصفح)
- لبناء تطبيق موبايل، يجب استخدام React Native

---

© 2025 Pizoo. جميع الحقوق محفوظة.
