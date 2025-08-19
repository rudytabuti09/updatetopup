import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserAccountSection = ({ userAccount, onAccountUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: userAccount?.email || '',
    phone: userAccount?.phone || '',
    gameId: userAccount?.gameId || ''
  });

  // Update formData when userAccount changes
  React.useEffect(() => {
    setFormData({
      email: userAccount?.email || '',
      phone: userAccount?.phone || '',
      gameId: userAccount?.gameId || ''
    });
  }, [userAccount]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onAccountUpdate(formData);
    setIsEditing(false);
  };

  const handleLogin = () => {
    // Redirect to login with current page as return URL
    navigate('/login', { state: { from: location } });
  };

  const handleSignup = () => {
    // Redirect to signup with current page as return URL
    navigate('/signup', { state: { from: location } });
  };

  const savedPaymentMethods = [
    {
      id: 'saved_dana',
      type: 'DANA',
      identifier: '****1234',
      isDefault: true
    },
    {
      id: 'saved_ovo',
      type: 'OVO',
      identifier: '****5678',
      isDefault: false
    }
  ];

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="User" size={24} className="text-primary" />
          <h2 className="text-xl font-gaming font-bold text-foreground">Informasi Akun</h2>
        </div>
        {userAccount && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconName={isEditing ? "X" : "Edit"}
            iconPosition="left"
          >
            {isEditing ? 'Batal' : 'Edit'}
          </Button>
        )}
      </div>
      {userAccount ? (
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-surface/30 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">
                {userAccount?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{userAccount?.name}</h3>
              <p className="text-sm text-text-secondary">{userAccount?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="Star" size={14} className="text-gaming-gold" />
                <span className="text-sm text-gaming-gold font-medium">Member VIP</span>
              </div>
            </div>
          </div>

          {/* Account Details Form */}
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              disabled={!isEditing}
              className="mb-4"
            />

            <Input
              label="Nomor Telepon"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              disabled={!isEditing}
              className="mb-4"
            />

            <Input
              label="Game ID/Username"
              type="text"
              value={formData?.gameId}
              onChange={(e) => handleInputChange('gameId', e?.target?.value)}
              disabled={!isEditing}
              description="ID dalam game untuk pengiriman item"
              className="mb-4"
            />

            {isEditing && (
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={handleSave}
                  iconName="Save"
                  iconPosition="left"
                >
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>

          {/* Saved Payment Methods */}
          <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-3">Metode Pembayaran Tersimpan</h4>
            <div className="space-y-2">
              {savedPaymentMethods?.map((method) => (
                <div
                  key={method?.id}
                  className="flex items-center justify-between p-3 bg-surface/20 rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="CreditCard" size={16} className="text-primary" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{method?.type}</span>
                      <span className="text-sm text-text-secondary ml-2">{method?.identifier}</span>
                    </div>
                    {method?.isDefault && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Purchase Benefits */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Icon name="Zap" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary mb-1">Pembelian Cepat Aktif</h4>
                <p className="text-sm text-primary/80">
                  Dengan akun terverifikasi, Anda dapat melakukan pembelian dengan satu klik menggunakan metode pembayaran tersimpan.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Guest Checkout */
        (<div className="space-y-4">
          <div className="text-center p-6 bg-surface/20 rounded-lg border-2 border-dashed border-border">
            <Icon name="UserPlus" size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Checkout sebagai Tamu</h3>
            <p className="text-sm text-text-secondary mb-4">
              Masuk atau daftar untuk pengalaman checkout yang lebih cepat
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                iconName="LogIn"
                iconPosition="left"
                onClick={handleLogin}
              >
                Masuk
              </Button>
              <Button
                variant="outline"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleSignup}
              >
                Daftar Gratis
              </Button>
            </div>
          </div>
          {/* Guest Form */}
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              required
              description="Untuk konfirmasi transaksi"
              className="mb-4"
            />

            <Input
              label="Nomor Telepon"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              required
              description="Untuk notifikasi status pembayaran"
              className="mb-4"
            />

            <Input
              label="Game ID/Username"
              type="text"
              value={formData?.gameId}
              onChange={(e) => handleInputChange('gameId', e?.target?.value)}
              required
              description="ID dalam game untuk pengiriman item"
              className="mb-4"
            />
          </div>
        </div>)
      )}
    </div>
  );
};

export default UserAccountSection;