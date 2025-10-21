# 🤝 Contributing to Pizoo

## 🎯 How to Contribute

نشكرك على اهتمامك بالمساهمة في Pizoo! نرحب بجميع المساهمات.

---

## 📋 قبل البدء

### 1. Fork المشروع
```bash
gh repo fork Shatha-db/pizoo
```

### 2. Clone المشروع
```bash
git clone https://github.com/YOUR-USERNAME/pizoo.git
cd pizoo
```

### 3. إنشاء Branch جديد
```bash
git checkout -b feature/amazing-feature
```

---

## 🔧 Development Setup

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend:
```bash
cd frontend
yarn install
yarn start
```

---

## 📝 Commit Guidelines

نستخدم [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile page
fix: resolve login bug
docs: update README
style: format code
refactor: restructure components
test: add unit tests
chore: update dependencies
```

### Examples:
```bash
git commit -m "feat(auth): add social login"
git commit -m "fix(chat): resolve message ordering"
git commit -m "docs: add API documentation"
```

---

## 🧪 Testing

### Frontend Tests:
```bash
cd frontend
yarn test
```

### Backend Tests:
```bash
cd backend
pytest
```

---

## 📤 Submit Changes

### 1. Push to Branch:
```bash
git push origin feature/amazing-feature
```

### 2. Create Pull Request:
- اذهب إلى GitHub
- اضغط "New Pull Request"
- املأ النموذج بوصف واضح
- أضف screenshots إذا أمكن

---

## ✅ Pull Request Checklist

- [ ] الكود يعمل بدون أخطاء
- [ ] تم اختبار جميع الميزات الجديدة
- [ ] التوثيق محدث
- [ ] Commit messages واضحة
- [ ] لا توجد تعليقات TODO غير محلولة
- [ ] الكود منظم ونظيف

---

## 🎨 Code Style

### JavaScript/React:
- استخدم ESLint
- 2 spaces للـ indentation
- استخدم semicolons
- استخدم single quotes

### Python:
- اتبع PEP 8
- 4 spaces للـ indentation
- استخدم type hints

---

## 🐛 Reporting Bugs

عند الإبلاغ عن bug، يرجى تضمين:

1. **الوصف:** ماذا حدث؟
2. **الخطوات:** كيف نعيد إنتاج المشكلة؟
3. **المتوقع:** ماذا كان متوقعاً؟
4. **Screenshots:** إذا أمكن
5. **البيئة:** المتصفح، النظام، إلخ

---

## 💡 Feature Requests

نرحب بأفكارك! اقترح ميزات جديدة عبر:

1. فتح Issue
2. وصف الميزة بالتفصيل
3. شرح الفائدة
4. إضافة mockups إذا أمكن

---

## 📞 Need Help?

- 📧 Email: support@pizoo.com
- 💬 Discord: [Join our server](https://discord.gg/pizoo)
- 🐦 Twitter: [@PizooApp](https://twitter.com/pizooapp)

---

## ⭐ Show Your Support

إذا أعجبك المشروع:
- ⭐ Star على GitHub
- 🐦 Share على Twitter
- 📝 Write a blog post
- 🎥 Create a video tutorial

---

شكراً لمساهمتك! 🎉