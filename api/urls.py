from django.urls import path
from . import views

urlpatterns = [
    # Health Check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication
    path('auth/register/', views.user_register, name='user_register'),
    path('auth/login/', views.user_login, name='user_login'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    
    # Music Management
    path('music/upload/', views.upload_music, name='upload_music'),
    path('music/artist-tracks/', views.get_artist_tracks, name='get_artist_tracks'),
    path('music/tracks/<uuid:track_id>/', views.get_track, name='get_track'),
    path('music/tracks/<uuid:track_id>/update/', views.update_track, name='update_track'),
    path('music/tracks/<uuid:track_id>/delete/', views.delete_track, name='delete_track'),
    
    # Admin Functions
    path('admin/pending-tracks/', views.get_pending_tracks, name='get_pending_tracks'),
    path('admin/all-tracks/', views.get_all_tracks, name='get_all_tracks'),
    path('admin/tracks/<uuid:track_id>/status/', views.update_track_status, name='update_track_status'),
    path('admin/stats/', views.get_admin_stats, name='get_admin_stats'),
    path('admin/artists/', views.get_artist_list, name='get_artist_list'),
    
    # User Profile
    path('users/profile/', views.get_user_profile, name='get_user_profile'),
    path('users/profile/update/', views.update_user_profile, name='update_user_profile'),
    path('users/notifications/', views.get_user_notifications, name='get_user_notifications'),
    path('users/notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),
    
    # Public
    path('genres/', views.get_genres, name='get_genres'),
    path('tracks/<uuid:track_id>/play/', views.record_play, name='record_play'),
]