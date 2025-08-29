from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime
import json

from .models import Track, Genre, PlayHistory, Notification
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    TrackSerializer, TrackUploadSerializer, TrackDetailSerializer,
    TrackStatusUpdateSerializer, PlayHistorySerializer, NotificationSerializer,
    AdminStatsSerializer
)

User = get_user_model()


# Health Check
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint to verify the API is running"""
    return Response(
        {"status": "ok", "message": "Music Platform API is running"},
        status=status.HTTP_200_OK
    )


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Forgot password endpoint"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        # Here you would typically send a password reset email
        # For now, we'll just return a success message
        return Response({
            'message': 'If an account with this email exists, a password reset link has been sent.'
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        # Don't reveal if user exists or not
        return Response({
            'message': 'If an account with this email exists, a password reset link has been sent.'
        }, status=status.HTTP_200_OK)


# Music Upload and Management Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_music(request):
    """Upload music track endpoint"""
    if request.user.user_type != 'artist':
        return Response({'error': 'Only artists can upload music'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = TrackUploadSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        track = serializer.save()
        
        # Create notification for admin
        Notification.objects.create(
            user=request.user,
            notification_type='track_processing',
            title='Track Uploaded',
            message=f'Your track "{track.title}" has been uploaded and is pending review.',
            track=track
        )
        
        return Response(TrackSerializer(track).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_artist_tracks(request):
    """Get tracks for the authenticated artist"""
    if request.user.user_type != 'artist':
        return Response({'error': 'Only artists can access this endpoint'}, status=status.HTTP_403_FORBIDDEN)
    
    tracks = Track.objects.filter(artist=request.user)
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_track(request, track_id):
    """Get specific track details"""
    try:
        track = Track.objects.get(id=track_id)
        # Check if user can access this track
        if request.user.user_type == 'artist' and track.artist != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TrackDetailSerializer(track)
        return Response(serializer.data)
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_track(request, track_id):
    """Update track information (artist only)"""
    try:
        track = Track.objects.get(id=track_id)
        if track.artist != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TrackSerializer(track, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_track(request, track_id):
    """Delete track (artist only)"""
    try:
        track = Track.objects.get(id=track_id)
        if track.artist != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        track.delete()
        return Response({'message': 'Track deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)


# Admin Views
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_pending_tracks(request):
    """Get all tracks for admin review"""
    tracks = Track.objects.all().order_by('-created_at')
    serializer = TrackDetailSerializer(tracks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_tracks(request):
    """Get all tracks with filtering options"""
    status_filter = request.query_params.get('status')
    genre_filter = request.query_params.get('genre')
    
    tracks = Track.objects.all()
    
    if status_filter:
        tracks = tracks.filter(status=status_filter)
    if genre_filter:
        tracks = tracks.filter(genre__name=genre_filter)
    
    tracks = tracks.order_by('-created_at')
    serializer = TrackDetailSerializer(tracks, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_track_status(request, track_id):
    """Update track status (admin only)"""
    try:
        track = Track.objects.get(id=track_id)
        serializer = TrackStatusUpdateSerializer(track, data=request.data, partial=True)
        
        if serializer.is_valid():
            old_status = track.status
            track = serializer.save()
            
            # Create notification for artist
            notification_type = f'track_{track.status}'
            title = f'Track {track.status.title()}'
            message = f'Your track "{track.title}" has been {track.status}.'
            
            if track.isrc:
                message += f' ISRC: {track.isrc}'
            
            Notification.objects.create(
                user=track.artist,
                notification_type=notification_type,
                title=title,
                message=message,
                track=track
            )
            
            return Response(TrackDetailSerializer(track).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_admin_stats(request):
    """Get admin dashboard statistics"""
    total_tracks = Track.objects.count()
    pending_tracks = Track.objects.filter(status='pending').count()
    approved_tracks = Track.objects.filter(status='approved').count()
    rejected_tracks = Track.objects.filter(status='rejected').count()
    total_artists = User.objects.filter(user_type='artist').count()
    total_listeners = User.objects.filter(user_type='listener').count()
    
    stats = {
        'total_tracks': total_tracks,
        'pending_tracks': pending_tracks,
        'approved_tracks': approved_tracks,
        'rejected_tracks': rejected_tracks,
        'total_artists': total_artists,
        'total_listeners': total_listeners,
    }
    
    serializer = AdminStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_artist_list(request):
    """Get list of all artists"""
    artists = User.objects.filter(user_type='artist')
    serializer = UserSerializer(artists, many=True)
    return Response(serializer.data)


# User Profile Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update current user profile"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_notifications(request):
    """Get current user notifications"""
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


# Public Views
@api_view(['GET'])
@permission_classes([AllowAny])
def get_genres(request):
    """Get all available genres"""
    genres = Genre.objects.all()
    from .serializers import GenreSerializer
    serializer = GenreSerializer(genres, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_play(request, track_id):
    """Record a track play for analytics"""
    try:
        track = Track.objects.get(id=track_id)
        
        # Record play
        PlayHistory.objects.create(
            track=track,
            listener=request.user if request.user.user_type == 'listener' else None,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Update play count
        track.play_count += 1
        track.save()
        
        return Response({'message': 'Play recorded'})
    except Track.DoesNotExist:
        return Response({'error': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)
