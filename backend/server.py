from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'pizoo-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    age: int
    gender: str
    bio: Optional[str] = ""
    location: str
    photos: List[str] = []
    interests: List[str] = []
    verified: bool = False
    height: Optional[str] = ""
    education: Optional[str] = ""
    work: Optional[str] = ""
    smoking: Optional[str] = ""
    drinking: Optional[str] = ""
    children: Optional[str] = ""
    online: bool = False
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    age: int
    gender: str
    location: str
    bio: Optional[str] = ""
    interests: List[str] = []
    height: Optional[str] = ""
    education: Optional[str] = ""
    work: Optional[str] = ""
    photos: List[str] = []

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    interests: List[str] = []
    height: Optional[str] = None
    education: Optional[str] = None
    work: Optional[str] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    children: Optional[str] = None
    photos: List[str] = []

class Swipe(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    to_user_id: str
    action: str  # "like" or "pass"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Match(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user1_id: str
    user2_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    match_id: str
    sender_id: str
    content: str
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # "match", "message", "like"
    title: str
    message: str
    data: dict = {}
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SwipeAction(BaseModel):
    to_user_id: str
    action: str

class MessageCreate(BaseModel):
    match_id: str
    content: str

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Update online status and last active
        await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "online": True,
                "last_active": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def create_notification(user_id: str, notif_type: str, title: str, message: str, data: dict = {}):
    notification = Notification(
        user_id=user_id,
        type=notif_type,
        title=title,
        message=message,
        data=data
    )
    doc = notification.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.notifications.insert_one(doc)

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.model_dump(exclude={"password"})
    user_obj = User(**user_dict)
    doc = user_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['last_active'] = doc['last_active'].isoformat()
    doc['password'] = hash_password(user_data.password)
    
    await db.users.insert_one(doc)
    
    token = create_token(user_obj.id)
    return {"token": token, "user": user_obj}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update online status
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {"online": True, "last_active": datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_token(user['id'])
    user.pop('password', None)
    user.pop('_id', None)
    return {"token": token, "user": user}

@api_router.post("/auth/logout")
async def logout(user_id: str = Depends(get_current_user)):
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"online": False}}
    )
    return {"success": True}

@api_router.get("/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# User Routes
@api_router.get("/users/discover")
async def discover_users(user_id: str = Depends(get_current_user)):
    # Get current user
    current_user = await db.users.find_one({"id": user_id})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get users already swiped
    swiped = await db.swipes.find({"from_user_id": user_id}).to_list(1000)
    swiped_ids = [s['to_user_id'] for s in swiped]
    swiped_ids.append(user_id)  # Exclude self
    
    # Get potential matches
    users = await db.users.find(
        {"id": {"$nin": swiped_ids}},
        {"_id": 0, "password": 0}
    ).to_list(50)
    
    return users

@api_router.get("/users/nearby")
async def nearby_users(user_id: str = Depends(get_current_user)):
    # Get current user
    current_user = await db.users.find_one({"id": user_id})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get users in same location (simplified)
    users = await db.users.find(
        {
            "id": {"$ne": user_id},
            "location": current_user['location']
        },
        {"_id": 0, "password": 0}
    ).to_list(100)
    
    return users

@api_router.get("/users/{user_id}")
async def get_user(user_id: str, current_user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/users/me")
async def update_profile(user_data: UserUpdate, user_id: str = Depends(get_current_user)):
    update_dict = {k: v for k, v in user_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.users.update_one(
            {"id": user_id},
            {"$set": update_dict}
        )
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return user

# Swipe Routes
@api_router.post("/swipes")
async def create_swipe(swipe_data: SwipeAction, user_id: str = Depends(get_current_user)):
    # Create swipe
    swipe = Swipe(
        from_user_id=user_id,
        to_user_id=swipe_data.to_user_id,
        action=swipe_data.action
    )
    doc = swipe.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.swipes.insert_one(doc)
    
    # Check for match if it's a like
    is_match = False
    match_id = None
    if swipe_data.action == "like":
        # Check if other user liked back
        reverse_swipe = await db.swipes.find_one({
            "from_user_id": swipe_data.to_user_id,
            "to_user_id": user_id,
            "action": "like"
        })
        
        if reverse_swipe:
            # Create match
            match = Match(
                user1_id=user_id,
                user2_id=swipe_data.to_user_id
            )
            match_doc = match.model_dump()
            match_doc['created_at'] = match_doc['created_at'].isoformat()
            await db.matches.insert_one(match_doc)
            is_match = True
            match_id = match.id
            
            # Create notifications for both users
            current_user = await db.users.find_one({"id": user_id})
            other_user = await db.users.find_one({"id": swipe_data.to_user_id})
            
            await create_notification(
                user_id,
                "match",
                "مطابقة جديدة!",
                f"لديك مطابقة جديدة مع {other_user['name']}",
                {"match_id": match_id, "user_id": swipe_data.to_user_id}
            )
            
            await create_notification(
                swipe_data.to_user_id,
                "match",
                "مطابقة جديدة!",
                f"لديك مطابقة جديدة مع {current_user['name']}",
                {"match_id": match_id, "user_id": user_id}
            )
        else:
            # Notify the other user they got a like
            current_user = await db.users.find_one({"id": user_id})
            await create_notification(
                swipe_data.to_user_id,
                "like",
                "إعجاب جديد!",
                f"{current_user['name']} أعجب بك",
                {"user_id": user_id}
            )
    
    return {"success": True, "is_match": is_match, "match_id": match_id}

@api_router.get("/swipes/likes-me")
async def get_likes_me(user_id: str = Depends(get_current_user)):
    # Get all likes to this user
    likes = await db.swipes.find({
        "to_user_id": user_id,
        "action": "like"
    }).to_list(1000)
    
    # Check which ones are not matched yet
    my_likes = await db.swipes.find({"from_user_id": user_id}).to_list(1000)
    my_liked_ids = [s['to_user_id'] for s in my_likes if s['action'] == 'like']
    
    # Filter out already matched
    unmatched_likes = [like_item for like_item in likes if like_item['from_user_id'] not in my_liked_ids]
    
    # Get user details
    result = []
    for like in unmatched_likes:
        user = await db.users.find_one({"id": like['from_user_id']}, {"_id": 0, "password": 0})
        if user:
            result.append({
                "user": user,
                "liked_at": like['created_at']
            })
    
    return result

# Match Routes
@api_router.get("/matches")
async def get_matches(user_id: str = Depends(get_current_user)):
    # Find all matches for this user
    matches = await db.matches.find({
        "$or": [
            {"user1_id": user_id},
            {"user2_id": user_id}
        ]
    }, {"_id": 0}).to_list(1000)
    
    # Get user details for each match
    result = []
    for match in matches:
        other_user_id = match['user2_id'] if match['user1_id'] == user_id else match['user1_id']
        user = await db.users.find_one({"id": other_user_id}, {"_id": 0, "password": 0})
        if user:
            # Get last message
            last_msg = await db.messages.find_one(
                {"match_id": match['id']},
                {"_id": 0},
                sort=[("created_at", -1)]
            )
            
            # Get unread count
            unread_count = await db.messages.count_documents({
                "match_id": match['id'],
                "sender_id": other_user_id,
                "read": False
            })
            
            result.append({
                "match_id": match['id'],
                "user": user,
                "last_message": last_msg,
                "unread_count": unread_count,
                "matched_at": match['created_at']
            })
    
    return result

# Message Routes
@api_router.get("/messages/{match_id}")
async def get_messages(match_id: str, user_id: str = Depends(get_current_user)):
    # Verify user is part of this match
    match = await db.matches.find_one({"id": match_id})
    if not match or (match['user1_id'] != user_id and match['user2_id'] != user_id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Mark messages as read
    await db.messages.update_many(
        {"match_id": match_id, "sender_id": {"$ne": user_id}},
        {"$set": {"read": True}}
    )
    
    messages = await db.messages.find(
        {"match_id": match_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(1000)
    
    return messages

@api_router.post("/messages")
async def send_message(msg_data: MessageCreate, user_id: str = Depends(get_current_user)):
    # Verify user is part of this match
    match = await db.matches.find_one({"id": msg_data.match_id})
    if not match or (match['user1_id'] != user_id and match['user2_id'] != user_id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    message = Message(
        match_id=msg_data.match_id,
        sender_id=user_id,
        content=msg_data.content
    )
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.messages.insert_one(doc)
    
    # Create notification for the other user
    other_user_id = match['user2_id'] if match['user1_id'] == user_id else match['user1_id']
    current_user = await db.users.find_one({"id": user_id})
    
    await create_notification(
        other_user_id,
        "message",
        "رسالة جديدة",
        f"رسالة جديدة من {current_user['name']}",
        {"match_id": msg_data.match_id, "message": msg_data.content}
    )
    
    return message

# Notification Routes
@api_router.get("/notifications")
async def get_notifications(user_id: str = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return notifications

@api_router.get("/notifications/unread-count")
async def get_unread_count(user_id: str = Depends(get_current_user)):
    count = await db.notifications.count_documents({
        "user_id": user_id,
        "read": False
    })
    return {"count": count}

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user_id: str = Depends(get_current_user)):
    await db.notifications.update_one(
        {"id": notification_id, "user_id": user_id},
        {"$set": {"read": True}}
    )
    return {"success": True}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(user_id: str = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": user_id},
        {"$set": {"read": True}}
    )
    return {"success": True}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()