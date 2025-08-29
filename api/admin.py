from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Track, Genre, PlayHistory, Notification


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'display_name', 'user_type', 'is_verified', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('email', 'display_name', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('display_name', 'bio', 'profile_picture')}),
        ('Permissions', {'fields': ('user_type', 'is_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'display_name', 'user_type', 'password1', 'password2'),
        }),
    )


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'genre', 'status', 'lyrics_status', 'isrc', 'play_count', 'created_at')
    list_filter = ('status', 'lyrics_status', 'genre', 'created_at')
    search_fields = ('title', 'artist__email', 'artist__display_name', 'isrc')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'play_count')
    
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'title', 'artist', 'genre', 'release_date')}),
        ('Media Files', {'fields': ('audio_file', 'cover_art')}),
        ('Content', {'fields': ('lyrics', 'lyrics_status')}),
        ('Status & Metadata', {'fields': ('status', 'isrc', 'play_count', 'admin_notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(PlayHistory)
class PlayHistoryAdmin(admin.ModelAdmin):
    list_display = ('track', 'listener', 'played_at', 'ip_address')
    list_filter = ('played_at',)
    search_fields = ('track__title', 'listener__email')
    ordering = ('-played_at',)
    readonly_fields = ('played_at',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'title', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
