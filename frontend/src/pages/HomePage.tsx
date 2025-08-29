import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

interface HealthStatus {
  status: string;
  message: string;
}

const HomePage = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await healthCheck();
        setHealthStatus(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to the API');
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Platform
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Your gateway to music distribution and streaming
          </p>

          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">API Status</h2>
            
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3">Checking API status...</span>
              </div>
            )}

            {error && (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {healthStatus && (
              <div className="text-green-400 bg-green-900/20 p-4 rounded-lg">
                <p className="font-semibold">Status: {healthStatus.status}</p>
                <p>{healthStatus.message}</p>
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3">For Artists</h3>
              <p className="text-gray-300">
                Upload your music, manage your catalog, and reach new audiences worldwide.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3">For Listeners</h3>
              <p className="text-gray-300">
                Discover new music, create playlists, and enjoy high-quality streaming.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
              <p className="text-gray-300">
                Connect with music lovers from around the world in one platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;