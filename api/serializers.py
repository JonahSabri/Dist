from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Track, Genre, PlayHistory, Notification


class UserSerializer(serializers.ModelSerializer):
    """User serializer for basic user information"""
    class Meta:
        model = User
        fields = ['id', 'email', 'display_name', 'user_type', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'display_name', 'user_type']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """User login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs


class GenreSerializer(serializers.ModelSerializer):
    """Genre serializer"""
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description']


class TrackSerializer(serializers.ModelSerializer):
    """Track serializer for basic track information"""
    artist = UserSerializer(read_only=True)
    genre = GenreSerializer(read_only=True)
    genre_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Track
        fields = [
            'id', 'title', 'artist', 'genre', 'genre_name', 'release_date', 
            'duration', 'lyrics', 'lyrics_status', 'isrc', 'status', 
            'play_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'artist', 'duration', 'isrc', 'play_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        genre_name = validated_data.pop('genre_name', None)
        if genre_name:
            genre, created = Genre.objects.get_or_create(name=genre_name)
            validated_data['genre'] = genre
        
        validated_data['artist'] = self.context['request'].user
        return super().create(validated_data)


class TrackUploadSerializer(serializers.ModelSerializer):
    """Track upload serializer with file handling"""
    genre_name = serializers.CharField(required=False)
    
    class Meta:
        model = Track
        fields = [
            'title', 'genre_name', 'release_date', 'lyrics', 
            'audio_file', 'cover_art'
        ]
    
    def create(self, validated_data):
        genre_name = validated_data.pop('genre_name', None)
        if genre_name:
            genre, created = Genre.objects.get_or_create(name=genre_name)
            validated_data['genre'] = genre
        
        validated_data['artist'] = self.context['request'].user
        return super().create(validated_data)


class TrackDetailSerializer(serializers.ModelSerializer):
    """Detailed track serializer for admin and detailed views"""
    artist = UserSerializer(read_only=True)
    genre = GenreSerializer(read_only=True)
    
    class Meta:
        model = Track
        fields = '__all__'


class TrackStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating track status (admin only)"""
    class Meta:
        model = Track
        fields = ['status', 'isrc', 'lyrics_status', 'admin_notes']
    
    def validate_isrc(self, value):
        if value and len(value) != 12:
            raise serializers.ValidationError("ISRC must be exactly 12 characters")
        return value


class PlayHistorySerializer(serializers.ModelSerializer):
    """Play history serializer"""
    track = TrackSerializer(read_only=True)
    
    class Meta:
        model = PlayHistory
        fields = ['id', 'track', 'played_at', 'ip_address']


class NotificationSerializer(serializers.ModelSerializer):
    """Notification serializer"""
    track = TrackSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'track', 'is_read', 'created_at']


class AdminStatsSerializer(serializers.Serializer):
    """Admin statistics serializer"""
    total_tracks = serializers.IntegerField()
    pending_tracks = serializers.IntegerField()
    approved_tracks = serializers.IntegerField()
    rejected_tracks = serializers.IntegerField()
    total_artists = serializers.IntegerField()
    total_listeners = serializers.IntegerField()