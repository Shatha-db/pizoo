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

class UserLogin(BaseModel):
    email: str
    password: str

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
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
    doc['password'] = hash_password(user_data.password)
    
    await db.users.insert_one(doc)
    
    token = create_token(user_obj.id)
    return {"token": token, "user": user_obj}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'])
    user.pop('password', None)
    user.pop('_id', None)
    return {"token": token, "user": user}

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

@api_router.get("/users/{user_id}")
async def get_user(user_id: str, current_user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
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
    
    return {"success": True, "is_match": is_match, "match_id": match_id}

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
            result.append({
                "match_id": match['id'],
                "user": user,
                "last_message": last_msg,
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
    
    return message

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