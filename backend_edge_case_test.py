#!/usr/bin/env python3
"""
Edge Case and Error Handling Tests for Pizoo Dating App
Tests authentication errors, validation, and edge cases
"""

import requests
import json
import uuid

# Configuration
BASE_URL = "https://pizoomatch.preview.emergentagent.com/api"

class PizooEdgeCaseTester:
    def __init__(self):
        self.base_url = BASE_URL
        
    def make_request(self, method, endpoint, data=None, token=None):
        """Make HTTP request with optional auth"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
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
    
    def test_duplicate_registration(self):
        """Test registering with same email twice"""
        print("\n🔐 Testing Duplicate Registration")
        
        test_email = f"duplicate_{uuid.uuid4().hex[:6]}@example.com"
        user_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Test User",
            "age": 25,
            "gender": "male",
            "location": "Test City"
        }
        
        # First registration
        response1 = self.make_request("POST", "/auth/register", user_data, token=None)
        if not response1 or response1.status_code not in [200, 201]:
            print(f"❌ First registration failed: {response1.status_code if response1 else 'No response'}")
            return False
        
        # Second registration with same email
        response2 = self.make_request("POST", "/auth/register", user_data, token=None)
        if response2 and response2.status_code == 400:
            print("✅ Duplicate registration properly rejected with 400")
            return True
        else:
            print(f"❌ Duplicate registration should return 400, got: {response2.status_code if response2 else 'No response'}")
            return False
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        print("\n🔐 Testing Invalid Login")
        
        invalid_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        response = self.make_request("POST", "/auth/login", invalid_data, token=None)
        if response and response.status_code == 401:
            print("✅ Invalid login properly rejected with 401")
            return True
        else:
            print(f"❌ Invalid login should return 401, got: {response.status_code if response else 'No response'}")
            return False
    
    def test_unauthorized_access(self):
        """Test accessing protected endpoints without token"""
        print("\n🔒 Testing Unauthorized Access")
        
        endpoints = [
            ("GET", "/auth/me"),
            ("GET", "/users/discover"),
            ("GET", "/matches"),
            ("GET", "/notifications")
        ]
        
        all_passed = True
        for method, endpoint in endpoints:
            response = self.make_request(method, endpoint, token=None)
            if response and response.status_code == 401:
                print(f"✅ {method} {endpoint} properly rejected (401)")
            else:
                print(f"❌ {method} {endpoint} should return 401, got: {response.status_code if response else 'No response'}")
                all_passed = False
        
        return all_passed
    
    def test_invalid_token(self):
        """Test accessing endpoints with invalid token"""
        print("\n🔒 Testing Invalid Token Access")
        
        invalid_token = "invalid.jwt.token"
        
        response = self.make_request("GET", "/auth/me", token=invalid_token)
        if response and response.status_code == 401:
            print("✅ Invalid token properly rejected with 401")
            return True
        else:
            print(f"❌ Invalid token should return 401, got: {response.status_code if response else 'No response'}")
            return False
    
    def test_nonexistent_user_profile(self):
        """Test getting profile of non-existent user"""
        print("\n👤 Testing Non-existent User Profile")
        
        # First, create a valid user to get a token
        test_email = f"temp_{uuid.uuid4().hex[:6]}@example.com"
        user_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Temp User",
            "age": 25,
            "gender": "male",
            "location": "Test City"
        }
        
        reg_response = self.make_request("POST", "/auth/register", user_data, token=None)
        if not reg_response or reg_response.status_code not in [200, 201]:
            print("❌ Failed to create temp user for test")
            return False
        
        token = reg_response.json().get("token")
        fake_user_id = str(uuid.uuid4())
        
        response = self.make_request("GET", f"/users/{fake_user_id}", token=token)
        if response and response.status_code == 404:
            print("✅ Non-existent user properly returns 404")
            return True
        else:
            print(f"❌ Non-existent user should return 404, got: {response.status_code if response else 'No response'}")
            return False
    
    def test_invalid_swipe_data(self):
        """Test swiping with invalid data"""
        print("\n💖 Testing Invalid Swipe Data")
        
        # Create a valid user to get a token
        test_email = f"swipe_{uuid.uuid4().hex[:6]}@example.com"
        user_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Swipe User",
            "age": 25,
            "gender": "male",
            "location": "Test City"
        }
        
        reg_response = self.make_request("POST", "/auth/register", user_data, token=None)
        if not reg_response or reg_response.status_code not in [200, 201]:
            print("❌ Failed to create user for swipe test")
            return False
        
        token = reg_response.json().get("token")
        
        # Test invalid swipe data
        invalid_swipe = {
            "to_user_id": "invalid-user-id",
            "action": "invalid-action"
        }
        
        response = self.make_request("POST", "/swipes", invalid_swipe, token=token)
        # This might return 400 for validation error or 404 for user not found
        if response and response.status_code in [400, 404]:
            print(f"✅ Invalid swipe data properly rejected ({response.status_code})")
            return True
        else:
            print(f"❌ Invalid swipe should return 400/404, got: {response.status_code if response else 'No response'}")
            return False
    
    def test_message_without_match(self):
        """Test sending message without valid match"""
        print("\n💬 Testing Message Without Match")
        
        # Create a valid user to get a token
        test_email = f"msg_{uuid.uuid4().hex[:6]}@example.com"
        user_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Message User",
            "age": 25,
            "gender": "male",
            "location": "Test City"
        }
        
        reg_response = self.make_request("POST", "/auth/register", user_data, token=None)
        if not reg_response or reg_response.status_code not in [200, 201]:
            print("❌ Failed to create user for message test")
            return False
        
        token = reg_response.json().get("token")
        fake_match_id = str(uuid.uuid4())
        
        message_data = {
            "match_id": fake_match_id,
            "content": "Hello there!"
        }
        
        response = self.make_request("POST", "/messages", message_data, token=token)
        if response and response.status_code == 403:
            print("✅ Message without valid match properly rejected (403)")
            return True
        else:
            print(f"❌ Message without match should return 403, got: {response.status_code if response else 'No response'}")
            return False
    
    def test_registration_validation(self):
        """Test registration with invalid data"""
        print("\n📝 Testing Registration Validation")
        
        invalid_registrations = [
            {
                "name": "Missing Email Test",
                "data": {
                    "password": "TestPass123!",
                    "name": "Test User",
                    "age": 25,
                    "gender": "male",
                    "location": "Test City"
                }
            },
            {
                "name": "Invalid Age Test",
                "data": {
                    "email": f"age_{uuid.uuid4().hex[:6]}@example.com",
                    "password": "TestPass123!",
                    "name": "Test User",
                    "age": -5,
                    "gender": "male",
                    "location": "Test City"
                }
            }
        ]
        
        all_passed = True
        for test_case in invalid_registrations:
            response = self.make_request("POST", "/auth/register", test_case["data"], token=None)
            if response and response.status_code == 422:  # Pydantic validation error
                print(f"✅ {test_case['name']} properly rejected (422)")
            else:
                print(f"❌ {test_case['name']} should return 422, got: {response.status_code if response else 'No response'}")
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all edge case tests"""
        print("🧪 Starting Pizoo Backend Edge Case Tests")
        print(f"📍 Testing against: {self.base_url}")
        
        results = {}
        
        results["duplicate_registration"] = self.test_duplicate_registration()
        results["invalid_login"] = self.test_invalid_login()
        results["unauthorized_access"] = self.test_unauthorized_access()
        results["invalid_token"] = self.test_invalid_token()
        results["nonexistent_user"] = self.test_nonexistent_user_profile()
        results["invalid_swipe"] = self.test_invalid_swipe_data()
        results["message_without_match"] = self.test_message_without_match()
        results["registration_validation"] = self.test_registration_validation()
        
        # Summary
        print("\n" + "="*60)
        print("📊 EDGE CASE TEST RESULTS")
        print("="*60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name.ljust(25)}: {status}")
        
        print(f"\n🎯 Overall: {passed}/{total} edge case tests passed ({passed/total*100:.1f}%)")
        
        return results

if __name__ == "__main__":
    tester = PizooEdgeCaseTester()
    results = tester.run_all_tests()