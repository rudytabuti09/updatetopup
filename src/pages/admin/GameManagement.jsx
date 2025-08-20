import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useSupabaseData from '../../hooks/useSupabaseData';
import { useVipResellerApi } from '../../hooks/useVipResellerApi';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const GameManagement = () => {
  const { user, profile } = useAuth();
  const { allGames, isLoading } = useSupabaseData();
  const { getServices, loading: vipLoading } = useVipResellerApi();
  const { showSuccess, showError } = useNotification();

  const [games, setGames] = useState([]);
  const [vipServices, setVipServices] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showServiceMapping, setShowServiceMapping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [serviceMappings, setServiceMappings] = useState({});

  useEffect(() => {
    if (allGames && allGames.length > 0) {
      setGames(allGames);
    }
  }, [allGames]);

  useEffect(() => {
    // Only load VIP services once when component mounts
    loadVipServices();
  }, []); // Empty dependency array to run only once

  const loadVipServices = async () => {
    try {
      const services = await getServices('game', null, 'available');
      setVipServices(services || []);
    } catch (error) {
      console.error('Error loading VIP services:', error);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && game.is_active) ||
                         (filterStatus === 'inactive' && !game.is_active) ||
                         (filterStatus === 'popular' && game.is_popular);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (gameId, currentStatus) => {
    try {
      // In a real app, you would update the game status in Supabase
      setGames(prev => prev.map(game => 
        game.id === gameId ? { ...game, is_active: !currentStatus } : game
      ));
      showSuccess(
        `Game ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        'Status Updated'
      );
    } catch (error) {
      showError('Failed to update game status', 'Error');
    }
  };

  const handleServiceMapping = (game) => {
    setSelectedGame(game);
    setShowServiceMapping(true);
  };

  const saveServiceMapping = async (gameId, mappings) => {
    try {
      // In a real app, you would save the service mappings to Supabase
      setServiceMappings(prev => ({ ...prev, [gameId]: mappings }));
      showSuccess('Service mappings saved successfully', 'Mappings Updated');
      setShowServiceMapping(false);
    } catch (error) {
      showError('Failed to save service mappings', 'Error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Game Management - WMX TOPUP Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <AdminHeader user={user} profile={profile} />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 ml-64 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-gaming font-bold text-gaming-gradient mb-2">
                  Game Management
                </h1>
                <p className="text-text-secondary">
                  Manage games, packages, and VIP Reseller service mappings
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={loadVipServices} variant="outline" loading={vipLoading}>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Sync VIP Services
                </Button>
                <Link to="/admin/games/add">
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Game
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search games by name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'inactive', 'popular'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        filterStatus === status
                          ? 'bg-primary text-black'
                          : 'bg-surface text-text-secondary hover:text-foreground'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div key={game.id} className="bg-card rounded-xl border border-border shadow-gaming hover:shadow-gaming-lg transition-all duration-200">
                  {/* Game Image */}
                  <div className="relative">
                    <Image
                      src={game.image_url || 'https://via.placeholder.com/400x200'}
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {game.is_popular && (
                        <span className="bg-gaming-gold text-black px-2 py-1 rounded-full text-xs font-bold">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        game.is_active 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {game.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-gaming font-bold text-foreground mb-1">
                          {game.name}
                        </h3>
                        <p className="text-sm text-text-secondary capitalize">
                          {game.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} className="text-gaming-gold fill-current" />
                        <span className="text-sm font-medium text-foreground">
                          {game.rating || 4.5}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-surface/20 rounded-lg">
                        <div className="text-sm font-bold text-foreground">
                          {game.packages?.length || 0}
                        </div>
                        <div className="text-xs text-text-secondary">Packages</div>
                      </div>
                      <div className="text-center p-2 bg-surface/20 rounded-lg">
                        <div className="text-sm font-bold text-foreground">
                          {formatCurrency(game.min_price || 0)}
                        </div>
                        <div className="text-xs text-text-secondary">Min Price</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleServiceMapping(game)}
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="GitBranch" size={14} />
                        <span className="text-sm">Map Services</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(game.id, game.is_active)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          game.is_active
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-500'
                        }`}
                      >
                        <Icon name={game.is_active ? 'Pause' : 'Play'} size={14} />
                      </button>
                      <Link to={`/admin/games/edit/${game.id}`}>
                        <button className="bg-surface/50 hover:bg-surface/70 text-foreground px-3 py-2 rounded-lg transition-colors">
                          <Icon name="Edit" size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Gamepad2" size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                  No Games Found
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first game'}
                </p>
                <Link to="/admin/games/add">
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Game
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Service Mapping Modal */}
      {showServiceMapping && selectedGame && (
        <ServiceMappingModal
          game={selectedGame}
          vipServices={vipServices}
          currentMappings={serviceMappings[selectedGame.id] || {}}
          onSave={(mappings) => saveServiceMapping(selectedGame.id, mappings)}
          onClose={() => setShowServiceMapping(false)}
        />
      )}
    </>
  );
};

// Service Mapping Modal Component
const ServiceMappingModal = ({ game, vipServices, currentMappings, onSave, onClose }) => {
  const [mappings, setMappings] = useState(currentMappings);

  const gameServices = vipServices.filter(service => 
    service.game?.toLowerCase().includes(game.name.toLowerCase())
  );

  const handleMappingChange = (packageId, serviceCode) => {
    setMappings(prev => ({
      ...prev,
      [packageId]: serviceCode
    }));
  };

  const handleSave = () => {
    onSave(mappings);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl border border-border shadow-gaming-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-gaming font-bold text-foreground">
              Service Mapping - {game.name}
            </h2>
            <p className="text-text-secondary text-sm">
              Map game packages to VIP Reseller service codes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Packages */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Game Packages
              </h3>
              <div className="space-y-3">
                {game.packages?.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-surface/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{pkg.amount}</span>
                      <span className="text-primary font-gaming font-bold">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>
                    <select
                      value={mappings[pkg.id] || ''}
                      onChange={(e) => handleMappingChange(pkg.id, e.target.value)}
                      className="w-full p-2 bg-surface border border-border rounded text-foreground"
                    >
                      <option value="">Select VIP Service Code</option>
                      {gameServices.map((service) => (
                        <option key={service.code} value={service.code}>
                          {service.code} - {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )) || (
                  <div className="text-center py-8 text-text-secondary">
                    No packages found for this game
                  </div>
                )}
              </div>
            </div>

            {/* VIP Services */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Available VIP Services
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {gameServices.map((service) => (
                  <div key={service.code} className="p-4 bg-surface/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{service.name}</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {service.code}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      Price: {formatCurrency(service.price?.premium || service.price?.basic || 0)}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      Status: {service.status}
                    </div>
                  </div>
                ))}
                {gameServices.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    No VIP services found for this game
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Mappings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameManagement;