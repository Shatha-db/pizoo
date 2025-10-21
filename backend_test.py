#!/usr/bin/env python3
"""
Comprehensive Backend Test for Pizoo Dating App
Tests all API endpoints with proper authentication flow
"""

import requests
import json
import uuid
from datetime import datetime
import time

# Configuration
BASE_URL = "https://pizoomatch.preview.emergentagent.com/api"
TEST_EMAIL = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
TEST_PASSWORD = "SecurePass123!"

class PizooAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_id = None
        self.test_user_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": "Sarah Ahmed",
            "age": 28,
            "gender": "female",
            "location": "Cairo, Egypt",
            "bio": "Love traveling and photography",
            "interests": ["photography", "travel", "music", "books"],
            "height": "165 cm",
            "education": "Computer Science Graduate",
            "work": "Software Engineer",
            "photos": ["https://example.com/photo1.jpg"]
        }
        self.discovered_users = []
        self.match_id = None
        
    def make_request(self, method, endpoint, data=None, auth_required=True):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if auth_required and self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed for {method} {endpoint}: {e}")
            return None
    
    def test_auth_register(self):
        """Test user registration"""
        print("\n🔐 Testing Authentication - Register")
        response = self.make_request("POST", "/auth/register", self.test_user_data, auth_required=False)
        
        if not response:
            return False
            
        if response.status_code == 201 or response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.token = data["token"]
                self.user_id = data["user"]["id"]
                print(f"✅ Registration successful - User ID: {self.user_id}")
                return True
            else:
                print(f"❌ Registration response missing token or user: {data}")
                return False
        else:
            print(f"❌ Registration failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_auth_login(self):
        """Test user login"""
        print("\n🔐 Testing Authentication - Login")
        login_data = {
            "email": self.test_user_data["email"],
            "password": self.test_user_data["password"]
        }
        
        response = self.make_request("POST", "/auth/login", login_data, auth_required=False)
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.token = data["token"]
                self.user_id = data["user"]["id"]
                print(f"✅ Login successful - Token received")
                return True
            else:
                print(f"❌ Login response missing token or user: {data}")
                return False
        else:
            print(f"❌ Login failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_auth_me(self):
        """Test get current user profile"""
        print("\n🔐 Testing Authentication - Get Me")
        response = self.make_request("GET", "/auth/me")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == self.user_id:
                print(f"✅ Get me successful - User: {data.get('name', 'Unknown')}")
                return True
            else:
                print(f"❌ Get me returned wrong user data: {data}")
                return False
        else:
            print(f"❌ Get me failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_users_discover(self):
        """Test user discovery"""
        print("\n👥 Testing User Discovery")
        response = self.make_request("GET", "/users/discover")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.discovered_users = data
                print(f"✅ Discovery successful - Found {len(data)} users")
                if len(data) > 0:
                    print(f"   Sample user: {data[0].get('name', 'Unknown')} ({data[0].get('age', 'Unknown')} years)")
                return True
            else:
                print(f"❌ Discovery returned non-list data: {data}")
                return False
        else:
            print(f"❌ Discovery failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_users_nearby(self):
        """Test nearby users"""
        print("\n📍 Testing Nearby Users")
        response = self.make_request("GET", "/users/nearby")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Nearby users successful - Found {len(data)} users")
                return True
            else:
                print(f"❌ Nearby users returned non-list data: {data}")
                return False
        else:
            print(f"❌ Nearby users failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_get_specific_user(self):
        """Test getting specific user profile"""
        if not self.discovered_users:
            print("\n👤 Skipping specific user test - No discovered users")
            return True
            
        print("\n👤 Testing Get Specific User")
        target_user = self.discovered_users[0]
        user_id = target_user["id"]
        
        response = self.make_request("GET", f"/users/{user_id}")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == user_id:
                print(f"✅ Get specific user successful - User: {data.get('name', 'Unknown')}")
                return True
            else:
                print(f"❌ Get specific user returned wrong data: {data}")
                return False
        else:
            print(f"❌ Get specific user failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_update_profile(self):
        """Test profile update"""
        print("\n✏️ Testing Profile Update")
        update_data = {
            "bio": "Updated bio: Love coding and coffee ☕",
            "interests": ["coding", "coffee", "hiking", "photography"],
            "work": "Senior Software Engineer"
        }
        
        response = self.make_request("PUT", "/users/me", update_data)
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "bio" in data and "Updated bio" in data["bio"]:
                print(f"✅ Profile update successful")
                return True
            else:
                print(f"❌ Profile update didn't reflect changes: {data}")
                return False
        else:
            print(f"❌ Profile update failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_swipe_like(self):
        """Test swiping (liking) a user"""
        if not self.discovered_users:
            print("\n💖 Skipping swipe test - No discovered users")
            return True
            
        print("\n💖 Testing Swipe (Like)")
        target_user = self.discovered_users[0]
        swipe_data = {
            "to_user_id": target_user["id"],
            "action": "like"
        }
        
        response = self.make_request("POST", "/swipes", swipe_data)
        
        if not response:
            return False
            
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            if "success" in data and data["success"]:
                is_match = data.get("is_match", False)
                if is_match:
                    self.match_id = data.get("match_id")
                    print(f"✅ Swipe successful - It's a match! Match ID: {self.match_id}")
                else:
                    print(f"✅ Swipe successful - No match yet")
                return True
            else:
                print(f"❌ Swipe response indicates failure: {data}")
                return False
        else:
            print(f"❌ Swipe failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_likes_me(self):
        """Test getting users who liked me"""
        print("\n💕 Testing Likes Me")
        response = self.make_request("GET", "/swipes/likes-me")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Likes me successful - {len(data)} users liked you")
                return True
            else:
                print(f"❌ Likes me returned non-list data: {data}")
                return False
        else:
            print(f"❌ Likes me failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_get_matches(self):
        """Test getting all matches"""
        print("\n💑 Testing Get Matches")
        response = self.make_request("GET", "/matches")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Get matches successful - {len(data)} matches found")
                if len(data) > 0 and not self.match_id:
                    self.match_id = data[0]["match_id"]
                    print(f"   Using match ID: {self.match_id}")
                return True
            else:
                print(f"❌ Get matches returned non-list data: {data}")
                return False
        else:
            print(f"❌ Get matches failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_send_message(self):
        """Test sending a message"""
        if not self.match_id:
            print("\n💬 Skipping send message test - No match available")
            return True
            
        print("\n💬 Testing Send Message")
        message_data = {
            "match_id": self.match_id,
            "content": "Hello! Nice to match with you 😊"
        }
        
        response = self.make_request("POST", "/messages", message_data)
        
        if not response:
            return False
            
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            if "content" in data and data["content"] == message_data["content"]:
                print(f"✅ Send message successful")
                return True
            else:
                print(f"❌ Send message response doesn't match: {data}")
                return False
        else:
            print(f"❌ Send message failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_get_messages(self):
        """Test getting messages for a match"""
        if not self.match_id:
            print("\n💬 Skipping get messages test - No match available")
            return True
            
        print("\n💬 Testing Get Messages")
        response = self.make_request("GET", f"/messages/{self.match_id}")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Get messages successful - {len(data)} messages found")
                return True
            else:
                print(f"❌ Get messages returned non-list data: {data}")
                return False
        else:
            print(f"❌ Get messages failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_get_notifications(self):
        """Test getting notifications"""
        print("\n🔔 Testing Get Notifications")
        response = self.make_request("GET", "/notifications")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Get notifications successful - {len(data)} notifications found")
                return True
            else:
                print(f"❌ Get notifications returned non-list data: {data}")
                return False
        else:
            print(f"❌ Get notifications failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_unread_count(self):
        """Test getting unread notification count"""
        print("\n🔔 Testing Unread Count")
        response = self.make_request("GET", "/notifications/unread-count")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "count" in data and isinstance(data["count"], int):
                print(f"✅ Unread count successful - {data['count']} unread notifications")
                return True
            else:
                print(f"❌ Unread count response invalid: {data}")
                return False
        else:
            print(f"❌ Unread count failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_mark_all_read(self):
        """Test marking all notifications as read"""
        print("\n🔔 Testing Mark All Read")
        response = self.make_request("PUT", "/notifications/read-all")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "success" in data and data["success"]:
                print(f"✅ Mark all read successful")
                return True
            else:
                print(f"❌ Mark all read response indicates failure: {data}")
                return False
        else:
            print(f"❌ Mark all read failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def test_auth_logout(self):
        """Test user logout"""
        print("\n🔐 Testing Authentication - Logout")
        response = self.make_request("POST", "/auth/logout")
        
        if not response:
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "success" in data and data["success"]:
                print(f"✅ Logout successful")
                return True
            else:
                print(f"❌ Logout response indicates failure: {data}")
                return False
        else:
            print(f"❌ Logout failed - Status: {response.status_code}, Response: {response.text}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Pizoo Dating App Backend Tests")
        print(f"📍 Testing against: {self.base_url}")
        print(f"👤 Test user email: {TEST_EMAIL}")
        
        results = {}
        
        # Authentication Flow
        results["register"] = self.test_auth_register()
        if not results["register"]:
            print("\n❌ Registration failed - cannot continue with other tests")
            return results
            
        results["login"] = self.test_auth_login()
        results["get_me"] = self.test_auth_me()
        
        # User Discovery
        results["discover"] = self.test_users_discover()
        results["nearby"] = self.test_users_nearby()
        results["get_user"] = self.test_get_specific_user()
        
        # Profile Management
        results["update_profile"] = self.test_update_profile()
        
        # Swipe & Match
        results["swipe"] = self.test_swipe_like()
        results["likes_me"] = self.test_likes_me()
        results["matches"] = self.test_get_matches()
        
        # Messaging
        results["send_message"] = self.test_send_message()
        results["get_messages"] = self.test_get_messages()
        
        # Notifications
        results["notifications"] = self.test_get_notifications()
        results["unread_count"] = self.test_unread_count()
        results["mark_read"] = self.test_mark_all_read()
        
        # Logout
        results["logout"] = self.test_auth_logout()
        
        # Summary
        print("\n" + "="*60)
        print("📊 TEST RESULTS SUMMARY")
        print("="*60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name.ljust(20)}: {status}")
        
        print(f"\n🎯 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("⚠️  Some tests failed. Please check the issues above.")
        
        return results

if __name__ == "__main__":
    tester = PizooAPITester()
    results = tester.run_all_tests()