#!/usr/bin/env python
"""
Setup script for the Music Platform
This script will:
1. Run migrations
2. Create a superuser
3. Create some sample genres
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Genre, User

def create_superuser():
    """Create a superuser if it doesn't exist"""
    User = get_user_model()
    
    if not User.objects.filter(is_superuser=True).exists():
        print("Creating superuser...")
        try:
            user = User.objects.create_superuser(
                email='admin@musicplatform.com',
                username='admin',
                password='admin123',
                display_name='Admin User',
                user_type='admin'
            )
            print(f"Superuser created: {user.email}")
            print("Username: admin@musicplatform.com")
            print("Password: admin123")
        except Exception as e:
            print(f"Error creating superuser: {e}")
    else:
        print("Superuser already exists")

def create_sample_genres():
    """Create some sample music genres"""
    genres = [
        'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
        'Country', 'R&B', 'Folk', 'Blues', 'Reggae', 'Metal',
        'Punk', 'Indie', 'Alternative', 'Dance', 'Ambient', 'Soundtrack'
    ]
    
    created_count = 0
    for genre_name in genres:
        genre, created = Genre.objects.get_or_create(name=genre_name)
        if created:
            created_count += 1
            print(f"Created genre: {genre_name}")
    
    print(f"Created {created_count} new genres")

def main():
    """Main setup function"""
    print("Setting up Music Platform...")
    
    # Run migrations
    print("Running migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create sample data
    create_sample_genres()
    create_superuser()
    
    print("\nSetup complete!")
    print("\nYou can now:")
    print("1. Start the backend: python manage.py runserver")
    print("2. Start the frontend: cd frontend && npm run dev")
    print("3. Access admin panel: http://localhost:8000/admin/")
    print("4. Login with admin@musicplatform.com / admin123")

if __name__ == '__main__':
    main()