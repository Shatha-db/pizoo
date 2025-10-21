# بناء تطبيق Android APK

تم إعداد المشروع بالكامل لبناء تطبيق Android باستخدام Capacitor!

## 📱 المكونات المثبتة
- ✅ Capacitor Core & CLI
- ✅ Capacitor Android Platform
- ✅ Android Project Setup
- ✅ TypeScript Support
- ✅ Manifest.json & PWA Support
- ✅ GitHub Actions Workflow

## 🔧 البناء المحلي

### 1. بناء تطبيق الويب
```bash
cd frontend
yarn build
```

### 2. مزامنة Capacitor
```bash
yarn cap:sync
# أو
npx cap sync android
```

### 3. فتح مشروع Android Studio
```bash
yarn cap:open:android
# أو
npx cap open android
```

### 4. بناء APK من Android Studio
1. في Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. سيتم حفظ APK في: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🚀 البناء التلقائي عبر GitHub Actions

تم إنشاء ملف `.github/workflows/android-build.yml` الذي يقوم بـ:

### الميزات:
- ✅ يعمل عند كل Push أو Pull Request
- ✅ يبني التطبيق تلقائياً
- ✅ ينشئ APK Debug
- ✅ يرفع APK كـ Artifact
- ✅ ينشئ Release تلقائي (اختياري)

### الإعداد المطلوب في GitHub:
1. اذهب إلى Settings > Secrets and variables > Actions
2. أضف Secret جديد:
   - Name: `REACT_APP_BACKEND_URL`
   - Value: رابط الـ Backend الخاص بك

### إصلاح خطأ yarn.lock:
الخطأ الذي كان يظهر في الصورة تم حله! المشكلة كانت:
- ❌ GitHub Actions كان يبحث عن `yarn.lock` في المجلد الرئيسي
- ✅ الحل: تحديد `working-directory: frontend` في الـ workflow
- ✅ تحديد `cache-dependency-path: frontend/yarn.lock`

## 📦 تنزيل APK بعد البناء

### من GitHub Actions:
1. اذهب إلى **Actions** tab في GitHub
2. اختر آخر workflow run
3. قم بتنزيل `app-debug` من Artifacts

### أو من Releases:
1. اذهب إلى **Releases** في GitHub
2. حمل ملف `app-debug.apk`

## 📲 تثبيت APK على الهاتف

### الطريقة 1: USB Debugging
```bash
# تأكد من تفعيل USB Debugging على الهاتف
adb install frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### الطريقة 2: نقل ملف APK مباشرة
1. انقل ملف `app-debug.apk` إلى هاتفك
2. افتح الملف من مدير الملفات
3. اسمح بالتثبيت من مصادر غير معروفة إذا طُلب منك

## 🔐 بناء APK موقّع للنشر (Release)

لبناء APK للنشر على Google Play:

1. أنشئ Keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. أضف معلومات Keystore في `android/key.properties`:
```properties
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

3. ابني APK Release:
```bash
cd android
./gradlew assembleRelease
```

## 🌐 تغيير Backend URL

عدّل ملف `frontend/.env`:
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

## ⚙️ تعديل معلومات التطبيق

### تغيير اسم التطبيق:
1. عدّل `frontend/capacitor.config.ts`:
```typescript
appName: 'اسم تطبيقك'
```

2. عدّل `frontend/android/app/src/main/res/values/strings.xml`

### تغيير App ID:
عدّل `frontend/capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.yourapp'
```

## 📝 ملاحظات مهمة

- ⚠️ APK Debug لا يصلح للنشر على Google Play - استخدم Release APK
- ⚠️ لا تشارك معلومات Keystore أبداً
- ✅ التطبيق يحتوي على INTERNET permission افتراضياً
- ✅ يدعم RTL للغة العربية

## 🎨 إضافة أيقونة مخصصة

ضع ملفات الأيقونات في:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

## 🆘 حل المشاكل الشائعة

### مشكلة: Gradle Build Failed
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### مشكلة: Java Version
تأكد من استخدام Java 17:
```bash
java -version
```

### مشكلة: Android SDK Missing
ثبّت Android Studio وتأكد من SDK Path في `local.properties`

## 📚 مصادر إضافية

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio)
- [Publishing on Google Play](https://developer.android.com/studio/publish)

---

**جاهز للبناء! 🚀**
