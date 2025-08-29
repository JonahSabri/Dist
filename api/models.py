from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid


class User(AbstractUser):
    """Custom user model with artist/listener/admin roles"""
    USER_TYPE_CHOICES = [
        ('artist', 'Artist'),
        ('listener', 'Listener'),
        ('admin', 'Admin'),
    ]
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='listener')
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'display_name']
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class Genre(models.Model):
    """Music genre model"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Track(models.Model):
    """Music track model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processing', 'Processing'),
    ]
    
    LYRICS_STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tracks')
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True)
    release_date = models.DateField()
    duration = models.DurationField(blank=True, null=True)
    audio_file = models.FileField(upload_to='audio_files/')
    cover_art = models.ImageField(upload_to='cover_art/', blank=True, null=True)
    lyrics = models.TextField(blank=True)
    lyrics_status = models.CharField(max_length=20, choices=LYRICS_STATUS_CHOICES, default='pending')
    isrc = models.CharField(max_length=12, blank=True, null=True, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    play_count = models.PositiveIntegerField(default=0)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.artist.display_name or self.artist.email}"
    
    class Meta:
        ordering = ['-created_at']


class PlayHistory(models.Model):
    """Track play history for analytics"""
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='play_history')
    listener = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    played_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.track.title} played at {self.played_at}"
    
    class Meta:
        ordering = ['-played_at']
        verbose_name_plural = 'Play History'


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPES = [
        ('track_approved', 'Track Approved'),
        ('track_rejected', 'Track Rejected'),
        ('track_processing', 'Track Processing'),
        ('lyrics_approved', 'Lyrics Approved'),
        ('lyrics_rejected', 'Lyrics Rejected'),
        ('isrc_assigned', 'ISRC Assigned'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    track = models.ForeignKey(Track, on_delete=models.CASCADE, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    class Meta:
        ordering = ['-created_at']
