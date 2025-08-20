import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/ui/Header';
import AdminAccessTest from '../components/AdminAccessTest';
import CreateAdminProfile from '../components/CreateAdminProfile';
import Icon from '../components/AppIcon';

const AdminTest = () => {
  const { user, profile, loading, isAdmin, isModerator } = useAuth();

  return (
    <>
      <Helmet>
        <title>Admin Access Test - WMX TOPUP</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-gaming font-bold text-gaming-gradient mb-4">
                  🔧 Admin Access Test
                </h1>
                <p className="text-text-secondary text-lg">
                  Test dan debug akses admin panel
                </p>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      user ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <Icon name="User" size={24} className={user ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <div>
                      <div className="text-2xl font-gaming font-bold text-foreground">
                        {user ? '✅' : '❌'}
                      </div>
                      <div className="text-sm text-text-secondary">User Logged In</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      profile ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <Icon name="UserCheck" size={24} className={profile ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <div>
                      <div className="text-2xl font-gaming font-bold text-foreground">
                        {profile ? '✅' : '❌'}
                      </div>
                      <div className="text-sm text-text-secondary">Profile Loaded</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isAdmin || isModerator ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <Icon name="Shield" size={24} className={isAdmin || isModerator ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <div>
                      <div className="text-2xl font-gaming font-bold text-foreground">
                        {isAdmin || isModerator ? '✅' : '❌'}
                      </div>
                      <div className="text-sm text-text-secondary">Admin Access</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
                <h2 className="text-xl font-gaming font-bold text-foreground mb-4">
                  Current Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Loading:</span>
                      <span className={loading ? 'text-yellow-500' : 'text-green-500'}>
                        {loading ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">User Email:</span>
                      <span className="text-foreground font-mono text-sm">
                        {user?.email || 'Not logged in'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">User ID:</span>
                      <span className="text-foreground font-mono text-xs">
                        {user?.id || 'None'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Profile Role:</span>
                      <span className={`font-medium ${
                        profile?.role === 'admin' ? 'text-red-500' :
                        profile?.role === 'moderator' ? 'text-orange-500' :
                        'text-blue-500'
                      }`}>
                        {profile?.role || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Is Verified:</span>
                      <span className={profile?.is_verified ? 'text-green-500' : 'text-red-500'}>
                        {profile?.is_verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Can Access Admin:</span>
                      <span className={isAdmin || isModerator ? 'text-green-500' : 'text-red-500'}>
                        {isAdmin || isModerator ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Admin Profile Component - Show if no profile */}
              {!profile && user && (
                <div className="mb-8">
                  <CreateAdminProfile />
                </div>
              )}

              {/* Admin Access Test Component */}
              <AdminAccessTest />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {(isAdmin || isModerator) ? (
                  <Link to="/admin" className="flex-1">
                    <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-gaming font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                      <Icon name="Shield" size={20} />
                      <span>Access Admin Panel</span>
                      <Icon name="ExternalLink" size={16} />
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-lg font-gaming font-bold text-center">
                    <Icon name="XCircle" size={20} className="inline mr-2" />
                    Admin Access Denied
                  </div>
                )}
                
                <Link to="/dashboard" className="flex-1">
                  <div className="w-full bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-gaming font-bold transition-colors text-center">
                    <Icon name="ArrowLeft" size={16} className="inline mr-2" />
                    Back to Dashboard
                  </div>
                </Link>
              </div>

              {/* Instructions */}
              <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-gaming font-bold text-blue-400 mb-4">
                  📋 Troubleshooting Steps
                </h3>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span>Pastikan Anda sudah login dengan akun yang benar</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span>Periksa apakah profile berhasil dimuat (Profile Loaded: ✅)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span>Pastikan role di database adalah 'admin' atau 'moderator'</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">4.</span>
                    <span>Gunakan tombol "Make This User Admin" jika diperlukan</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">5.</span>
                    <span>Klik "Refresh Profile" setelah mengubah role di database</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">6.</span>
                    <span>Periksa console browser untuk error (F12 → Console)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminTest;