#!/usr/bin/env python
"""
Demo script for testing the Music Platform API
This script demonstrates the main API endpoints
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:8000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health/")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the backend is running.")
        return False
    return True

def test_user_registration():
    """Test user registration"""
    print("\n👤 Testing User Registration...")
    
    user_data = {
        "email": "demo@artist.com",
        "password": "demo12345",
        "confirm_password": "demo12345",
        "display_name": "Demo Artist",
        "user_type": "artist"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=user_data)
        if response.status_code == 201:
            print("✅ User registration successful")
            user_info = response.json()
            print(f"   User ID: {user_info['user']['id']}")
            print(f"   Email: {user_info['user']['email']}")
            return user_info['access'], user_info['refresh']
        else:
            print(f"❌ User registration failed: {response.status_code}")
            print(f"   Error: {response.json()}")
            return None, None
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        return None, None

def test_user_login():
    """Test user login"""
    print("\n🔑 Testing User Login...")
    
    login_data = {
        "email": "demo@artist.com",
        "password": "demo12345"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=login_data)
        if response.status_code == 200:
            print("✅ User login successful")
            user_info = response.json()
            return user_info['access'], user_info['refresh']
        else:
            print(f"❌ User login failed: {response.status_code}")
            return None, None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None, None

def test_upload_music(access_token):
    """Test music upload (requires authentication)"""
    print("\n🎵 Testing Music Upload...")
    
    if not access_token:
        print("❌ No access token available")
        return None
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Create a simple text file as a mock audio file
    files = {
        'audio_file': ('demo_track.mp3', b'fake audio data', 'audio/mpeg'),
        'cover_art': ('demo_cover.jpg', b'fake image data', 'image/jpeg')
    }
    
    data = {
        'title': 'Demo Track',
        'genre_name': 'Pop',
        'release_date': '2024-01-01',
        'lyrics': 'This is a demo track for testing purposes.'
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/music/upload/",
            headers=headers,
            data=data,
            files=files
        )
        
        if response.status_code == 201:
            print("✅ Music upload successful")
            track_info = response.json()
            print(f"   Track ID: {track_info['id']}")
            print(f"   Title: {track_info['title']}")
            return track_info['id']
        else:
            print(f"❌ Music upload failed: {response.status_code}")
            print(f"   Error: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Error during music upload: {e}")
        return None

def test_get_artist_tracks(access_token):
    """Test getting artist tracks"""
    print("\n📋 Testing Get Artist Tracks...")
    
    if not access_token:
        print("❌ No access token available")
        return
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/music/artist-tracks/", headers=headers)
        if response.status_code == 200:
            tracks = response.json()
            print(f"✅ Retrieved {len(tracks)} tracks")
            for track in tracks:
                print(f"   - {track['title']} ({track['status']})")
        else:
            print(f"❌ Failed to get tracks: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting tracks: {e}")

def test_get_genres():
    """Test getting available genres"""
    print("\n🎼 Testing Get Genres...")
    
    try:
        response = requests.get(f"{BASE_URL}/genres/")
        if response.status_code == 200:
            genres = response.json()
            print(f"✅ Retrieved {len(genres)} genres")
            for genre in genres[:5]:  # Show first 5
                print(f"   - {genre['name']}")
        else:
            print(f"❌ Failed to get genres: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting genres: {e}")

def main():
    """Main demo function"""
    print("🎵 Music Platform API Demo")
    print("=" * 40)
    
    # Test health check first
    if not test_health_check():
        return
    
    # Test public endpoints
    test_get_genres()
    
    # Test user registration
    access_token, refresh_token = test_user_registration()
    
    if access_token:
        # Test authenticated endpoints
        test_upload_music(access_token)
        test_get_artist_tracks(access_token)
    else:
        print("\n⚠️  Skipping authenticated tests due to registration failure")
    
    print("\n🎉 Demo completed!")
    print("\nTo run the full demo:")
    print("1. Make sure the backend is running: python manage.py runserver")
    print("2. Run this script: python demo.py")

if __name__ == "__main__":
    main()