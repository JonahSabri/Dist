import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthCheck } from '../services/api';
import { Music, Globe, ArrowRight, Upload, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800">
      {/* Header */}
      <header className="bg-glass-white backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music className="w-8 h-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-white">Music Platform</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
            Your Gateway to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Music Distribution
            </span>
          </h1>
          <p className="text-xl mb-12 text-secondary-200 leading-relaxed">
            Upload your music, reach global audiences, and manage your catalog with our professional music distribution platform. 
            Connect with listeners worldwide and take your music career to the next level.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Start Uploading</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-secondary-200">Professional tools and global reach for serious artists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-glass-white backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/30 transition-colors">
              <Upload className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Easy Upload</h3>
            <p className="text-secondary-200 leading-relaxed">
              Simple and intuitive music upload process with support for all major audio formats. 
              Get your tracks ready for distribution in minutes.
            </p>
          </div>

          <div className="bg-glass-white backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-500/30 transition-colors">
              <Globe className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Global Distribution</h3>
            <p className="text-secondary-200 leading-relaxed">
              Reach listeners worldwide through our extensive network of streaming platforms, 
              digital stores, and radio stations.
            </p>
          </div>

          <div className="bg-glass-white backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Analytics & Insights</h3>
            <p className="text-secondary-200 leading-relaxed">
              Track your music's performance with detailed analytics, play counts, 
              and audience insights to grow your fanbase.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-secondary-200">Get your music distributed in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Upload Your Music</h3>
            <p className="text-secondary-200">
              Upload your audio files, add metadata, and provide lyrics if available
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Review & Approval</h3>
            <p className="text-secondary-200">
              Our team reviews your content and assigns ISRC codes for distribution
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Global Release</h3>
            <p className="text-secondary-200">
              Your music goes live on all major platforms worldwide
            </p>
          </div>
        </div>
      </section>

      {/* API Status Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-glass-white backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Status</h2>
            
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Checking platform status...</span>
              </div>
            )}

            {error && (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
                <p className="font-semibold">Connection Error</p>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Share Your Music?</h2>
          <p className="text-xl text-secondary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of artists who trust our platform for their music distribution needs. 
            Start your journey today and reach audiences worldwide.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 inline-flex items-center space-x-2 group"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-glass-white backdrop-blur-md border-t border-white/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Music className="w-8 h-8 text-primary-400" />
            <h3 className="text-2xl font-bold text-white">Music Platform</h3>
          </div>
          <p className="text-secondary-200 mb-6">
            Professional music distribution for artists worldwide
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/login" className="text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-white/70 hover:text-white transition-colors">
              Sign Up
            </Link>
            <Link to="/forgot-password" className="text-white/70 hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute top-40 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-40 right-20 w-24 h-24 bg-secondary-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-80 right-40 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
    </div>
  );
};

export default HomePage;