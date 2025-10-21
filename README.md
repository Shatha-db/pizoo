# 💜 Pizoo - Dating App

<div align="center">

![Pizoo Logo](https://img.shields.io/badge/Pizoo-Dating%20App-purple?style=for-the-badge)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Shatha-db/pizoo)
[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel)](https://pizoo.vercel.app)

**تطبيق تعارف حديث مستوحى من Badoo**

</div>

---

## 🌟 Overview

Pizoo هو تطبيق تعارف شامل يجمع بين تجربة **Web و Mobile** في منصة واحدة، مع دعم **5 لغات** وتصميم عصري.

### ✨ Key Features

- 💜 **تصميم Badoo** - ألوان بنفسجية ووردية أنيقة
- 🌍 **5 لغات** - العربية (RTL)، English، Español، Français، Deutsch  
- 📱 **Web + Mobile** - يعمل على المتصفح و Android/iOS
- 💬 **دردشة مباشرة** - Real-time messaging
- 💖 **نظام سوايب** - Tinder-style matching
- 🎯 **مطابقات ذكية** - Intelligent matching algorithm
- 🔔 **إشعارات فورية** - Push notifications
- ✅ **ملفات موثقة** - Verified profiles
- 🌐 **حالة الاتصال** - Online/offline status
- #️⃣ **الاهتمامات** - Interest-based matching

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.9+
- MongoDB
- Java 17+ (للـ Android)
- Android Studio (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Shatha-db/pizoo.git
cd pizoo

# Backend setup
cd backend
pip install -r requirements.txt
python seed_demo_users.py
uvicorn server:app --reload --port 8001

# Frontend setup (new terminal)
cd frontend
yarn install
yarn start
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

---

## 📱 Screenshots

### Web App
![Landing](docs/screenshots/landing.png)
![Discover](docs/screenshots/discover.png)
![Chat](docs/screenshots/chat.png)

### Mobile App
![Android Home](docs/screenshots/android-home.png)
![Android Profile](docs/screenshots/android-profile.png)

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database  
- **Motor** - Async MongoDB driver
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Capacitor** - Native wrapper
- **i18next** - Internationalization

### Mobile
- **Capacitor** - Cross-platform
- **Android SDK** - Native Android
- **Gradle** - Build system

### DevOps
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **Emergent** - Full-stack hosting

---

## 📂 Project Structure

```
pizoo/
├── backend/           # FastAPI Backend
├── frontend/          # React Frontend
│   ├── src/
│   │   ├── pages/    # App pages
│   │   ├── components/ # UI components
│   │   ├── i18n/     # Translations
│   │   └── locales/  # Language files
│   ├── android/      # Android project
│   └── ios/          # iOS project (future)
├── .github/workflows/ # CI/CD pipelines
└── docs/             # Documentation
```

[📖 Full Structure Guide](PROJECT_STRUCTURE.md)

---

## 🌐 Deployment

### Web App (Vercel)

```bash
# Push to GitHub
git push origin main

# Vercel will auto-deploy
# Or deploy manually:
vercel --prod
```

[📘 Deployment Guide](DEPLOYMENT.md)

### Mobile App (Android)

```bash
# Local build
cd frontend
./build-android.sh

# GitHub Actions
# Go to Actions → Build Android APK → Run workflow
```

[📱 Mobile Guide](MOBILE_DEVELOPMENT_GUIDE.md)

---

## 🌍 Internationalization

### Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| 🇬🇧 English | `en` | LTR | ✅ Complete |
| 🇸🇦 العربية | `ar` | RTL | ✅ Complete |
| 🇪🇸 Español | `es` | LTR | ✅ Complete |
| 🇫🇷 Français | `fr` | LTR | ✅ Complete |
| 🇩🇪 Deutsch | `de` | LTR | ✅ Complete |

### Adding New Language

1. Create `/frontend/src/locales/[lang].json`
2. Add translations
3. Update `/frontend/src/i18n/config.js`
4. Test RTL if needed

---

## 👥 Demo Accounts

Test the app with these accounts:

```
Email: sarah@demo.com | Password: demo123
Email: ahmed@demo.com | Password: demo123
Email: layla@demo.com | Password: demo123
Email: omar@demo.com | Password: demo123
Email: mira@demo.com | Password: demo123
```

---

## 🛠️ Development

### Available Scripts

```bash
# Frontend
yarn start          # Dev server
yarn build          # Production build
yarn test           # Run tests
yarn cap:sync       # Sync Capacitor
yarn build:android  # Build Android APK

# Backend
uvicorn server:app --reload  # Dev server
pytest                        # Run tests
```

### Environment Variables

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=https://api.pizoo.com
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=false
```

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=pizoo_database
JWT_SECRET=your-secret-key
CORS_ORIGINS=*
```

---

## 🧪 Testing

```bash
# Frontend
cd frontend
yarn test

# Backend
cd backend
pytest

# E2E Tests
npm run test:e2e
```

---

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/discover` - Get potential matches
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/me` - Update profile

### Swipes
- `POST /api/swipes` - Swipe (like/pass)
- `GET /api/swipes/likes-me` - Who liked you

### Matches
- `GET /api/matches` - Get all matches

### Messages
- `GET /api/messages/{match_id}` - Get messages
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read

[📖 Full API Docs](http://localhost:8001/docs)

---

## 🤝 Contributing

We welcome contributions!

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

[📘 Contributing Guide](CONTRIBUTING.md)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 📄 License

This project is proprietary software.  
© 2025 Pizoo. All rights reserved.

---

## 🙏 Acknowledgments

- **Badoo** - Design inspiration
- **Shadcn UI** - Component library
- **Capacitor** - Mobile wrapper
- **FastAPI** - Backend framework
- **Emergent** - Development platform

---

## 📞 Support

- 📧 Email: support@pizoo.com
- 💬 Discord: [Join Server](https://discord.gg/pizoo)
- 🐦 Twitter: [@PizooApp](https://twitter.com/pizooapp)
- 📚 Docs: [docs.pizoo.com](https://docs.pizoo.com)

---

## 🗺️ Roadmap

- [ ] 🍎 iOS App
- [ ] 📹 Video Chat
- [ ] 🎁 Virtual Gifts
- [ ] 💎 Premium Features
- [ ] 🔍 Advanced Search
- [ ] 🎮 Icebreaker Games
- [ ] 📊 Analytics Dashboard
- [ ] 🔗 Social Login
- [ ] 🎵 Voice Messages
- [ ] 📸 Stories Feature

---

<div align="center">

**Made with 💜 by the Pizoo Team**

[Website](https://pizoo.com) • [GitHub](https://github.com/Shatha-db/pizoo) • [Twitter](https://twitter.com/pizooapp)

</div>
