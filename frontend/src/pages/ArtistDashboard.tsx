import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { uploadMusic, getArtistTracks } from '../services/api';
import { Music, Upload, BarChart3, User, LogOut } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  isrc?: string;
  play_count?: number;
  upload_date: string;
  lyrics_status?: 'pending' | 'approved' | 'rejected';
}

const ArtistDashboard = () => {
  const { user, logout } = useAuthStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: '',
    genre: '',
    release_date: '',
    lyrics: '',
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const response = await getArtistTracks();
      setTracks(response.data);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', selectedFile);
      formData.append('title', uploadForm.title);
      formData.append('artist', uploadForm.artist);
      formData.append('genre', uploadForm.genre);
      formData.append('release_date', uploadForm.release_date);
      formData.append('lyrics', uploadForm.lyrics);

      await uploadMusic(formData);
      
      // Reset form
      setUploadForm({
        title: '',
        artist: '',
        genre: '',
        release_date: '',
        lyrics: '',
      });
      setSelectedFile(null);
      
      // Reload tracks
      await loadTracks();
      
      // Switch to tracks tab
      setActiveTab('tracks');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800">
      {/* Header */}
      <header className="bg-glass-white backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music className="w-8 h-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-white">Artist Dashboard</h1>
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
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Upload Music
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'tracks'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            My Tracks
          </button>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Tracks</p>
                  <p className="text-2xl font-bold text-white">{tracks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Plays</p>
                  <p className="text-2xl font-bold text-white">
                    {tracks.reduce((sum, track) => sum + (track.play_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-glass-white backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Approved Tracks</p>
                  <p className="text-2xl font-bold text-white">
                    {tracks.filter(track => track.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Music Form */}
        {activeTab === 'upload' && (
          <div className="bg-glass-white backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Upload New Track</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter track title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={uploadForm.artist}
                    onChange={(e) => setUploadForm({...uploadForm, artist: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={uploadForm.genre}
                    onChange={(e) => setUploadForm({...uploadForm, genre: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter genre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={uploadForm.release_date}
                    onChange={(e) => setUploadForm({...uploadForm, release_date: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Lyrics (Optional)
                </label>
                <textarea
                  value={uploadForm.lyrics}
                  onChange={(e) => setUploadForm({...uploadForm, lyrics: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Enter lyrics..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Audio File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
                {selectedFile && (
                  <p className="text-sm text-white/70 mt-2">Selected: {selectedFile.name}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Track'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tracks List */}
        {activeTab === 'tracks' && (
          <div className="bg-glass-white backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">My Tracks</h2>
            
            {tracks.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No tracks uploaded yet. Start by uploading your first track!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{track.title}</h3>
                        <p className="text-white/70 mb-2">Artist: {track.artist}</p>
                        <div className="flex items-center space-x-4 text-sm">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;