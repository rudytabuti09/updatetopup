import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySettings = ({ securityData, onSecurityUpdate }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const securitySections = [
    { id: 'overview', label: 'Ringkasan Keamanan', icon: 'Shield' },
    { id: 'password', label: 'Kata Sandi', icon: 'Key' },
    { id: 'twofa', label: 'Autentikasi 2 Faktor', icon: 'Smartphone' },
    { id: 'devices', label: 'Perangkat Terpercaya', icon: 'Monitor' },
    { id: 'activity', label: 'Aktivitas Login', icon: 'Activity' }
  ];

  const getSecurityScore = () => {
    let score = 0;
    if (securityData?.hasStrongPassword) score += 25;
    if (securityData?.twoFactorEnabled) score += 35;
    if (securityData?.trustedDevices?.length > 0) score += 20;
    if (securityData?.recentActivity?.length === 0) score += 20;
    return score;
  };

  const renderOverview = () => {
    const securityScore = getSecurityScore();
    const getScoreColor = (score) => {
      if (score >= 80) return 'text-success';
      if (score >= 60) return 'text-warning';
      return 'text-error';
    };

    return (
      <div className="space-y-6">
        {/* Security Score */}
        <div className="bg-gradient-to-r from-surface to-muted rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Skor Keamanan</h4>
            <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                securityScore >= 80 ? 'bg-success' : 
                securityScore >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${securityScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-secondary">
            {securityScore >= 80 ? 'Keamanan akun Anda sangat baik!' :
             securityScore >= 60 ? 'Keamanan akun Anda cukup baik, tapi bisa ditingkatkan.': 'Keamanan akun Anda perlu ditingkatkan segera.'}
          </p>
        </div>
        {/* Security Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${
            securityData?.hasStrongPassword 
              ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={securityData?.hasStrongPassword ? "CheckCircle" : "XCircle"} 
                size={24} 
                className={securityData?.hasStrongPassword ? "text-success" : "text-error"} 
              />
              <div>
                <h5 className="font-medium text-foreground">Kata Sandi Kuat</h5>
                <p className="text-sm text-text-secondary">
                  {securityData?.hasStrongPassword 
                    ? 'Kata sandi Anda sudah kuat' :'Gunakan kata sandi yang lebih kuat'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            securityData?.twoFactorEnabled 
              ? 'bg-success/10 border-success/20' :'bg-warning/10 border-warning/20'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={securityData?.twoFactorEnabled ? "CheckCircle" : "AlertCircle"} 
                size={24} 
                className={securityData?.twoFactorEnabled ? "text-success" : "text-warning"} 
              />
              <div>
                <h5 className="font-medium text-foreground">Autentikasi 2 Faktor</h5>
                <p className="text-sm text-text-secondary">
                  {securityData?.twoFactorEnabled 
                    ? '2FA sudah aktif' 
                    : 'Aktifkan 2FA untuk keamanan ekstra'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            securityData?.emailVerified 
              ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={securityData?.emailVerified ? "CheckCircle" : "XCircle"} 
                size={24} 
                className={securityData?.emailVerified ? "text-success" : "text-error"} 
              />
              <div>
                <h5 className="font-medium text-foreground">Email Terverifikasi</h5>
                <p className="text-sm text-text-secondary">
                  {securityData?.emailVerified 
                    ? 'Email sudah terverifikasi' 
                    : 'Verifikasi email Anda'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            securityData?.phoneVerified 
              ? 'bg-success/10 border-success/20' :'bg-warning/10 border-warning/20'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={securityData?.phoneVerified ? "CheckCircle" : "AlertCircle"} 
                size={24} 
                className={securityData?.phoneVerified ? "text-success" : "text-warning"} 
              />
              <div>
                <h5 className="font-medium text-foreground">Nomor HP Terverifikasi</h5>
                <p className="text-sm text-text-secondary">
                  {securityData?.phoneVerified 
                    ? 'Nomor HP sudah terverifikasi' 
                    : 'Verifikasi nomor HP Anda'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Kata Sandi</h4>
            <p className="text-sm text-text-secondary">
              Terakhir diubah: {securityData?.lastPasswordChange}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Icon name="Edit" size={16} className="mr-2" />
            Ubah Kata Sandi
          </Button>
        </div>

        {showChangePassword && (
          <div className="space-y-4 pt-4 border-t border-border">
            <Input
              label="Kata Sandi Saat Ini"
              type="password"
              placeholder="Masukkan kata sandi saat ini"
              required
            />
            <Input
              label="Kata Sandi Baru"
              type="password"
              placeholder="Masukkan kata sandi baru"
              description="Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol"
              required
            />
            <Input
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              placeholder="Konfirmasi kata sandi baru"
              required
            />
            <div className="flex items-center space-x-3">
              <Button variant="default" className="bg-gradient-to-r from-primary to-secondary">
                Simpan Perubahan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowChangePassword(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Password Strength Tips */}
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <h5 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="Lightbulb" size={20} className="text-primary mr-2" />
          Tips Kata Sandi Kuat
        </h5>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Minimal 8 karakter</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Kombinasi huruf besar dan kecil</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Mengandung angka dan simbol</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Tidak menggunakan informasi pribadi</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const render2FASection = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Autentikasi 2 Faktor</h4>
            <p className="text-sm text-text-secondary">
              {securityData?.twoFactorEnabled 
                ? 'Autentikasi 2 faktor sudah aktif' 
                : 'Tambahkan lapisan keamanan ekstra'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            securityData?.twoFactorEnabled 
              ? 'bg-success/20 text-success' :'bg-error/20 text-error'
          }`}>
            {securityData?.twoFactorEnabled ? 'Aktif' : 'Tidak Aktif'}
          </div>
        </div>

        {!securityData?.twoFactorEnabled ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="Smartphone" size={24} className="text-primary" />
                  <h5 className="font-medium text-foreground">Aplikasi Authenticator</h5>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Gunakan Google Authenticator atau aplikasi serupa
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShow2FASetup(true)}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Setup Sekarang
                </Button>
              </div>

              <div className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                  <h5 className="font-medium text-foreground">SMS</h5>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Terima kode verifikasi melalui SMS
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Setup SMS
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-success" />
                <span className="text-sm text-foreground">
                  2FA aktif dengan {securityData?.twoFactorMethod}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-error/30 text-error hover:bg-error/10"
              >
                Nonaktifkan
              </Button>
            </div>
            
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h5 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Key" size={16} className="text-warning mr-2" />
                Kode Cadangan
              </h5>
              <p className="text-sm text-text-secondary mb-3">
                Simpan kode cadangan ini di tempat yang aman untuk mengakses akun jika perangkat hilang
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-warning/30 text-warning hover:bg-warning/10"
              >
                Lihat Kode Cadangan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDevicesSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">
          Perangkat Terpercaya ({securityData?.trustedDevices?.length})
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="border-error/30 text-error hover:bg-error/10"
        >
          <Icon name="LogOut" size={16} className="mr-2" />
          Logout Semua
        </Button>
      </div>

      <div className="space-y-3">
        {securityData?.trustedDevices?.map((device) => (
          <div
            key={device?.id}
            className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={device?.type === 'mobile' ? 'Smartphone' : 'Monitor'} 
                size={20} 
                className="text-primary" 
              />
              <div>
                <h5 className="font-medium text-foreground">{device?.name}</h5>
                <p className="text-sm text-text-secondary">
                  {device?.location} • Terakhir aktif: {device?.lastActive}
                </p>
                {device?.isCurrent && (
                  <span className="text-xs text-success">Perangkat ini</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {device?.isCurrent ? (
                <div className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">
                  Aktif
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10"
                >
                  <Icon name="X" size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivitySection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">
          Aktivitas Login Terbaru
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Download" size={16} className="mr-2" />
          Export Log
        </Button>
      </div>

      <div className="space-y-3">
        {securityData?.recentActivity?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-success mx-auto mb-4" />
            <p className="text-text-secondary">Tidak ada aktivitas mencurigakan</p>
          </div>
        ) : (
          securityData?.recentActivity?.map((activity) => (
            <div
              key={activity?.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                activity?.suspicious 
                  ? 'bg-error/10 border-error/20' :'bg-surface border-border'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={activity?.suspicious ? "AlertTriangle" : "LogIn"} 
                  size={20} 
                  className={activity?.suspicious ? "text-error" : "text-primary"} 
                />
                <div>
                  <h5 className="font-medium text-foreground">{activity?.action}</h5>
                  <p className="text-sm text-text-secondary">
                    {activity?.location} • {activity?.device} • {activity?.timestamp}
                  </p>
                </div>
              </div>
              
              {activity?.suspicious && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-error/30 text-error hover:bg-error/10"
                >
                  Laporkan
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="Shield" size={24} className="text-primary mr-3" />
          Pengaturan Keamanan
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            getSecurityScore() >= 80 ? 'bg-success' : 
            getSecurityScore() >= 60 ? 'bg-warning' : 'bg-error'
          }`}></div>
          <span className="text-sm text-text-secondary">
            Skor: {getSecurityScore()}/100
          </span>
        </div>
      </div>
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {securitySections?.map((section) => (
          <button
            key={section?.id}
            onClick={() => setActiveSection(section?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeSection === section?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Icon name={section?.icon} size={16} />
            <span className="text-sm font-medium">{section?.label}</span>
          </button>
        ))}
      </div>
      {/* Section Content */}
      <div>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'password' && renderPasswordSection()}
        {activeSection === 'twofa' && render2FASection()}
        {activeSection === 'devices' && renderDevicesSection()}
        {activeSection === 'activity' && renderActivitySection()}
      </div>
    </div>
  );
};

export default SecuritySettings;