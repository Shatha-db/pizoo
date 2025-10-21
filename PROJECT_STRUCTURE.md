# 📁 Pizoo - Project Structure

## 🏗️ هيكل المشروع

```
pizoo/
├── 📂 backend/                    # FastAPI Backend
│   ├── server.py                  # Main API endpoints
│   ├── seed_demo_users.py         # Demo users seeder
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Backend environment variables
│
├── 📂 frontend/                   # React Frontend
│   ├── 📂 public/                 # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/         # Reusable UI components
│   │   │   └── 📂 ui/             # Shadcn UI components
│   │   ├── 📂 pages/              # Application pages
│   │   │   ├── Landing.jsx        # Landing page
│   │   │   ├── Auth.jsx           # Authentication
│   │   │   ├── Encounters.jsx     # Grid view
│   │   │   ├── Discover.jsx       # Swipe view
│   │   │   ├── Matches.jsx        # Matches list
│   │   │   ├── LikesMe.jsx        # Who likes you
│   │   │   ├── Chat.jsx           # Chat interface
│   │   │   ├── Notifications.jsx  # Notifications
│   │   │   ├── Profile.jsx        # User profile
│   │   │   └── UserProfile.jsx    # Other user profile
│   │   ├── 📂 i18n/               # Internationalization
│   │   │   └── config.js          # i18n configuration
│   │   ├── 📂 locales/            # Translation files
│   │   │   ├── en.json            # English
│   │   │   ├── ar.json            # Arabic
│   │   │   ├── es.json            # Spanish
│   │   │   ├── fr.json            # French
│   │   │   └── de.json            # German
│   │   ├── 📂 lib/                # Utility functions
│   │   ├── 📂 hooks/              # Custom React hooks
│   │   ├── App.js                 # Main App component
│   │   ├── App.css                # Global styles
│   │   ├── index.js               # Entry point
│   │   └── index.css              # Base styles
│   ├── 📂 android/                # Android native project
│   ├── 📂 ios/                    # iOS native project (future)
│   ├── capacitor.config.ts        # Capacitor configuration
│   ├── build-android.sh           # Android build script
│   ├── package.json               # Node dependencies
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── .env                       # Frontend environment variables
│
├── 📂 .github/                    # GitHub configurations
│   └── 📂 workflows/              # GitHub Actions
│       └── build-android.yml      # Android build workflow
│
├── 📂 tests/                      # Test files
├── 📂 scripts/                    # Utility scripts
│
├── 📄 .gitignore                  # Git ignore rules
├── 📄 vercel.json                 # Vercel deployment config
├── 📄 .vercelignore               # Vercel ignore rules
├── 📄 README.md                   # Main documentation
├── 📄 DEPLOYMENT.md               # Deployment guide
├── 📄 MOBILE_DEVELOPMENT_GUIDE.md # Mobile development guide
└── 📄 PROJECT_STRUCTURE.md        # This file
```

---

## 📦 Core Technologies

### Backend:
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend:
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **date-fns** - Date utilities
- **Capacitor** - Native mobile wrapper
- **i18next** - Internationalization

### Mobile:
- **Capacitor** - Cross-platform native runtime
- **Android SDK** - Android development
- **Gradle** - Android build system

### DevOps:
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **Emergent** - Full-stack hosting option

---

## 🗂️ File Naming Conventions

### React Components:
- **Pages:** PascalCase with `.jsx` extension
  - Example: `Landing.jsx`, `Discover.jsx`
  
- **Components:** PascalCase with `.jsx` extension
  - Example: `Button.jsx`, `UserCard.jsx`
  
- **Utilities:** camelCase with `.js` extension
  - Example: `utils.js`, `api.js`

### Python:
- **Modules:** snake_case with `.py` extension
  - Example: `server.py`, `seed_demo_users.py`

### Configuration:
- Lowercase with appropriate extension
  - Example: `package.json`, `tailwind.config.js`

---

## 🎨 Code Organization

### Component Structure:
```jsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3. State & Hooks
  const [state, setState] = useState();
  
  // 4. Functions
  const handleClick = () => {};
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Render
  return (
    <div data-testid="my-component">
      {/* Content */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### Backend Structure:
```python
# 1. Imports
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 2. Models
class User(BaseModel):
    name: str
    email: str

# 3. Routes
@app.get("/users")
async def get_users():
    return users
```

---

## 🔄 Data Flow

```
User Action
    ↓
React Component
    ↓
API Call (axios)
    ↓
FastAPI Endpoint
    ↓
MongoDB Query
    ↓
Response
    ↓
Component Update
    ↓
UI Render
```

---

## 🎯 Best Practices

### 1. **Always use data-testid:**
```jsx
<Button data-testid="submit-btn">Submit</Button>
```

### 2. **Environment variables:**
```javascript
const API_URL = process.env.REACT_APP_BACKEND_URL;
```

### 3. **Error handling:**
```javascript
try {
  const response = await api.get('/users');
} catch (error) {
  toast.error('Failed to load users');
}
```

### 4. **Translation keys:**
```javascript
const { t } = useTranslation();
<h1>{t('welcome')}</h1>
```

### 5. **Async/await in Python:**
```python
@app.get("/users")
async def get_users():
    users = await db.users.find().to_list(100)
    return users
```

---

## 📝 Notes

- All API endpoints must be prefixed with `/api`
- Use RTL for Arabic language
- Always validate user input
- Follow MongoDB naming conventions
- Use proper HTTP status codes
- Implement proper error handling
- Add loading states
- Use proper TypeScript types (when applicable)

---

© 2025 Pizoo. All rights reserved.