import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getPendingTracks, updateTrackStatus, getAdminStats } from '../services/api';
import { Shield, Music, CheckCircle, Clock, BarChart3, User, LogOut } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  artist_email: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  isrc?: string;
  play_count?: number;
  upload_date: string;
  lyrics_status?: 'pending' | 'approved' | 'rejected';
  genre: string;
  release_date: string;
  lyrics?: string;
}

interface AdminStats {
  total_tracks: number;
  pending_tracks: number;
  approved_tracks: number;
  rejected_tracks: number;
  total_artists: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    isrc: '',
    lyrics_status: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tracksResponse, statsResponse] = await Promise.all([
        getPendingTracks(),
        getAdminStats(),
      ]);
      setTracks(tracksResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (trackId: string) => {
    try {
      await updateTrackStatus(trackId, updateForm);
      
      // Reload data
      await loadData();
      
      // Reset form and close modal
      setUpdateForm({
        status: '',
        isrc: '',
        lyrics_status: '',
        notes: '',
      });
      setSelectedTrack(null);
    } catch (error) {
      console.error('Failed to update track:', error);
    }
  };

  const openUpdateModal = (track: Track) => {
    setSelectedTrack(track);
    setUpdateForm({
      status: track.status,
      isrc: track.isrc || '',
      lyrics_status: track.lyrics_status || 'pending',
      notes: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20';
      case 'rejected': return 'text-red-400 bg-red-900/20';
      case 'processing': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-blue-400 bg-blue-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'processing': return 'Processing';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800">
      {/* Header */}
      <header className="bg-glass-white backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5" />
                <span>{user?.display_name || user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-glass-white backdrop-blur-md rounded-lg p-1 mb-8 border border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Pending Tracks
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All Tracks
          </button>
        </div>

        {/* Overview Stats */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Tracks</p>
                  <p className="text-2xl font-bold text-white">{stats.total_tracks}</p>
                </div>
              </div>
            </div>

            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pending_tracks}</p>
                </div>
              </div>
            </div>

            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-white">{stats.approved_tracks}</p>
                </div>
              </div>
            </div>

            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Artists</p>
                  <p className="text-2xl font-bold text-white">{stats.total_artists}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Tracks */}
        {activeTab === 'pending' && (
          <div className="bg-glass-white backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Tracks Pending Review</h2>
            
            {tracks.filter(track => track.status === 'pending').length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
                <p className="text-white/70">No tracks pending review. All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tracks
                  .filter(track => track.status === 'pending')
                  .map((track) => (
                    <div key={track.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{track.title}</h3>
                          <p className="text-white/70 mb-2">Artist: {track.artist}</p>
                          <p className="text-white/70 mb-2">Email: {track.artist_email}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-white/60">Genre: {track.genre}</span>
                            <span className="text-white/60">Release: {track.release_date}</span>
                            <span className="text-white/60">Uploaded: {new Date(track.upload_date).toLocaleDateString()}</span>
                          </div>
                          {track.lyrics && (
                            <div className="mt-3">
                              <p className="text-white/60 text-sm mb-1">Lyrics Preview:</p>
                              <p className="text-white/80 text-sm line-clamp-2">{track.lyrics}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(track.status)}`}>
                            {getStatusText(track.status)}
                          </span>
                          <button
                            onClick={() => openUpdateModal(track)}
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                          >
                            Review Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* All Tracks */}
        {activeTab === 'all' && (
          <div className="bg-glass-white backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">All Tracks</h2>
            
            <div className="space-y-4">
              {tracks.map((track) => (
                <div key={track.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{track.title}</h3>
                      <p className="text-white/70 mb-2">Artist: {track.artist}</p>
                      <p className="text-white/70 mb-2">Email: {track.artist_email}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white/60">Genre: {track.genre}</span>
                        <span className="text-white/60">Release: {track.release_date}</span>
                        <span className="text-white/60">Uploaded: {new Date(track.upload_date).toLocaleDateString()}</span>
                        {track.isrc && (
                          <span className="text-white/60">ISRC: {track.isrc}</span>
                        )}
                        {track.play_count !== undefined && (
                          <span className="text-white/60">Plays: {track.play_count}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(track.status)}`}>
                        {getStatusText(track.status)}
                      </span>
                      {track.lyrics_status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(track.lyrics_status)}`}>
                          Lyrics: {getStatusText(track.lyrics_status)}
                        </span>
                      )}
                      <button
                        onClick={() => openUpdateModal(track)}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Update Track Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-glass-white backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Update Track Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Track Status</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="pending" className="bg-primary-800 text-white">Pending</option>
                  <option value="approved" className="bg-primary-800 text-white">Approved</option>
                  <option value="rejected" className="bg-primary-800 text-white">Rejected</option>
                  <option value="processing" className="bg-primary-800 text-white">Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">ISRC Code</label>
                <input
                  type="text"
                  value={updateForm.isrc}
                  onChange={(e) => setUpdateForm({...updateForm, isrc: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Enter ISRC code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Lyrics Status</label>
                <select
                  value={updateForm.lyrics_status}
                  onChange={(e) => setUpdateForm({...updateForm, lyrics_status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="pending" className="bg-primary-800 text-white">Pending</option>
                  <option value="approved" className="bg-primary-800 text-white">Approved</option>
                  <option value="rejected" className="bg-primary-800 text-white">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Notes (Optional)</label>
                <textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Add any notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedTrack(null)}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTrack.id)}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;