import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import useSupabaseData from '../../hooks/useSupabaseData';
import { useVipResellerApi } from '../../hooks/useVipResellerApi';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const ServiceManagement = () => {
  const { user, profile } = useAuth();
  const { allGames, isLoading } = useSupabaseData();
  const { getServices, checkBalance, loading: vipLoading } = useVipResellerApi();
  const { showSuccess, showError, showInfo } = useNotification();

  const [vipServices, setVipServices] = useState([]);
  const [serviceMappings, setServiceMappings] = useState({});
  const [vipBalance, setVipBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGame, setFilterGame] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [syncingServices, setSyncingServices] = useState(false);

  useEffect(() => {
    loadVipServices();
    loadVipBalance();
    loadServiceMappings();
  }, []);

  const loadVipServices = async () => {
    try {
      setSyncingServices(true);
      const services = await getServices('game', null, 'available');
      setVipServices(services || []);
      showSuccess('VIP services synced successfully', 'Services Updated');
    } catch (error) {
      console.error('Error loading VIP services:', error);
      showError('Failed to sync VIP services', 'Sync Error');
    } finally {
      setSyncingServices(false);
    }
  };

  const loadVipBalance = async () => {
    try {
      const balance = await checkBalance();
      setVipBalance(balance?.balance || 0);
    } catch (error) {
      console.error('Error loading VIP balance:', error);
    }
  };

  const loadServiceMappings = () => {
    // In production, load from Supabase
    const mockMappings = {
      'game1': {
        'pkg1': 'ML275',
        'pkg2': 'ML720'
      },
      'game2': {
        'pkg1': 'FF720',
        'pkg2': 'FF1450'
      }
    };
    setServiceMappings(mockMappings);
  };

  const filteredServices = vipServices.filter(service => {
    const matchesSearch = 
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.game?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGame = filterGame === 'all' || 
      service.game?.toLowerCase().includes(filterGame.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    
    return matchesSearch && matchesGame && matchesStatus;
  });

  const gameOptions = [...new Set(vipServices.map(s => s.game))].filter(Boolean);

  const handleBulkAction = async (action) => {
    if (selectedServices.length === 0) {
      showInfo('Please select services first', 'No Services Selected');
      return;
    }

    try {
      // In production, perform bulk actions via API
      showSuccess(`Bulk ${action} completed for ${selectedServices.length} services`, 'Bulk Action Complete');
      setSelectedServices([]);
    } catch (error) {
      showError(`Failed to perform bulk ${action}`, 'Error');
    }
  };

  const handleServiceMapping = (game) => {
    setSelectedGame(game);
    setShowMappingModal(true);
  };

  const saveServiceMapping = async (gameId, mappings) => {
    try {
      setServiceMappings(prev => ({ ...prev, [gameId]: mappings }));
      showSuccess('Service mappings saved successfully', 'Mappings Updated');
      setShowMappingModal(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-500 bg-green-500/10';
      case 'unavailable':
        return 'text-red-500 bg-red-500/10';
      case 'maintenance':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-text-secondary bg-surface/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading service management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Service Management - WMX TOPUP Admin</title>
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
                  Service Management
                </h1>
                <p className="text-text-secondary">
                  Manage VIP Reseller services and game package mappings
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-card rounded-lg px-4 py-2 border border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="Wallet" size={16} className="text-primary" />
                    <span className="text-sm text-text-secondary">VIP Balance:</span>
                    <span className="font-gaming font-bold text-foreground">
                      {formatCurrency(vipBalance)}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={loadVipServices} 
                  variant="outline" 
                  loading={syncingServices}
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Sync Services
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {vipServices.length}
                    </div>
                    <div className="text-sm text-text-secondary">Total Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {vipServices.filter(s => s.status === 'available').length}
                    </div>
                    <div className="text-sm text-text-secondary">Available</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="GitBranch" size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {Object.keys(serviceMappings).length}
                    </div>
                    <div className="text-sm text-text-secondary">Mapped Games</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Gamepad2" size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {gameOptions.length}
                    </div>
                    <div className="text-sm text-text-secondary">Game Types</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search services by name, code, or game..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={filterGame}
                    onChange={(e) => setFilterGame(e.target.value)}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Games</option>
                    {gameOptions.map((game) => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              
              {/* Bulk Actions */}
              {selectedServices.length > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-text-secondary">
                    {selectedServices.length} service(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('enable')}
                    >
                      Enable
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('disable')}
                      className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                    >
                      Disable
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedServices([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Services Table */}
            <div className="bg-card rounded-xl border border-border shadow-gaming overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface/20 border-b border-border">
                    <tr>
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices(filteredServices.map(s => s.code));
                            } else {
                              setSelectedServices([]);
                            }
                          }}
                          className="rounded border-border"
                        />
                      </th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Service</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Game</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Price</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Status</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Mapped</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.code} className="border-b border-border hover:bg-surface/10 transition-colors">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices(prev => [...prev, service.code]);
                              } else {
                                setSelectedServices(prev => prev.filter(code => code !== service.code));
                              }
                            }}
                            className="rounded border-border"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">{service.name}</div>
                            <div className="text-sm text-text-secondary font-mono">{service.code}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <Icon name="Gamepad2" size={14} className="text-black" />
                            </div>
                            <span className="text-foreground">{service.game}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">
                            {formatCurrency(service.price?.premium || service.price?.basic || 0)}
                          </div>
                          {service.price?.premium && service.price?.basic && (
                            <div className="text-xs text-text-secondary">
                              Basic: {formatCurrency(service.price.basic)}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {Object.values(serviceMappings).some(mapping => 
                            Object.values(mapping).includes(service.code)
                          ) ? (
                            <div className="flex items-center gap-1">
                              <Icon name="CheckCircle" size={16} className="text-green-500" />
                              <span className="text-sm text-green-500">Mapped</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Icon name="AlertCircle" size={16} className="text-yellow-500" />
                              <span className="text-sm text-yellow-500">Unmapped</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Icon name="Eye" size={14} className="text-text-secondary" />
                            </button>
                            <button
                              className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                              title="Test Service"
                            >
                              <Icon name="Play" size={14} className="text-text-secondary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Game Mapping Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-gaming font-bold text-foreground">
                    Game Service Mappings
                  </h2>
                  <p className="text-text-secondary">
                    Map your game packages to VIP Reseller service codes
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allGames?.map((game) => (
                  <div key={game.id} className="bg-card rounded-xl border border-border shadow-gaming">
                    <div className="relative">
                      <Image
                        src={game.image_url || 'https://via.placeholder.com/400x200'}
                        alt={game.name}
                        className="w-full h-32 object-cover rounded-t-xl"
                      />
                      <div className="absolute top-4 right-4">
                        {serviceMappings[game.id] ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Mapped
                          </span>
                        ) : (
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                            Unmapped
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-gaming font-bold text-foreground mb-2">
                        {game.name}
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        {game.packages?.length || 0} packages available
                      </p>
                      
                      <Button
                        onClick={() => handleServiceMapping(game)}
                        variant="outline"
                        className="w-full"
                      >
                        <Icon name="GitBranch" size={16} className="mr-2" />
                        Configure Mapping
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Service Mapping Modal */}
      {showMappingModal && selectedGame && (
        <ServiceMappingModal
          game={selectedGame}
          vipServices={vipServices}
          currentMappings={serviceMappings[selectedGame.id] || {}}
          onSave={(mappings) => saveServiceMapping(selectedGame.id, mappings)}
          onClose={() => setShowMappingModal(false)}
        />
      )}
    </>
  );
};

// Service Mapping Modal Component (reused from GameManagement)
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

export default ServiceManagement;