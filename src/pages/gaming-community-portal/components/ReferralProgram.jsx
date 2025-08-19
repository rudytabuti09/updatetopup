import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReferralProgram = () => {
  const [referralCode, setReferralCode] = useState('WMX-GAMER-2025');
  const [copied, setCopied] = useState(false);

  const referralStats = {
    totalReferrals: 47,
    activeReferrals: 32,
    totalEarnings: 'Rp 2.350.000',
    monthlyEarnings: 'Rp 450.000',
    nextReward: 'Rp 100.000',
    referralsNeeded: 3
  };

  const rewardTiers = [
    {
      id: 1,
      referrals: 5,
      reward: 'Rp 50.000',
      bonus: 'Badge Bronze Referrer',
      achieved: true
    },
    {
      id: 2,
      referrals: 15,
      reward: 'Rp 200.000',
      bonus: 'Badge Silver Referrer + 5% Bonus',
      achieved: true
    },
    {
      id: 3,
      referrals: 35,
      reward: 'Rp 500.000',
      bonus: 'Badge Gold Referrer + 10% Bonus',
      achieved: true
    },
    {
      id: 4,
      referrals: 50,
      reward: 'Rp 1.000.000',
      bonus: 'Badge Platinum Referrer + 15% Bonus',
      achieved: false,
      current: true
    },
    {
      id: 5,
      referrals: 100,
      reward: 'Rp 2.500.000',
      bonus: 'Badge Diamond Referrer + 20% Bonus',
      achieved: false
    }
  ];

  const recentReferrals = [
    {
      id: 1,
      username: 'GamerBaru123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      joinedAt: '2 hari lalu',
      firstPurchase: 'Rp 50.000',
      commission: 'Rp 5.000',
      status: 'active'
    },
    {
      id: 2,
      username: 'MLFanatic88',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinedAt: '5 hari lalu',
      firstPurchase: 'Rp 100.000',
      commission: 'Rp 10.000',
      status: 'active'
    },
    {
      id: 3,
      username: 'PUBGLover_ID',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      joinedAt: '1 minggu lalu',
      firstPurchase: 'Rp 75.000',
      commission: 'Rp 7.500',
      status: 'active'
    },
    {
      id: 4,
      username: 'FFChampion',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      joinedAt: '2 minggu lalu',
      firstPurchase: 'Pending',
      commission: 'Rp 0',
      status: 'pending'
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const shareText = `Gabung di WMX TOPUP dengan kode referral saya ${referralCode} dan dapatkan bonus top-up!`;
    const shareUrl = `https://wmxtopup.com/register?ref=${referralCode}`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };
    
    window.open(urls?.[platform], '_blank');
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Program Referral
        </h2>
        <div className="text-sm text-muted-foreground">
          Komisi: 10% dari setiap pembelian
        </div>
      </div>
      {/* Referral Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {referralStats?.totalReferrals}
          </div>
          <div className="text-sm text-muted-foreground">Total Referral</div>
        </div>
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-2xl font-bold text-success mb-1">
            {referralStats?.activeReferrals}
          </div>
          <div className="text-sm text-muted-foreground">Aktif</div>
        </div>
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-2xl font-bold text-gaming-gold mb-1">
            {referralStats?.totalEarnings}
          </div>
          <div className="text-sm text-muted-foreground">Total Komisi</div>
        </div>
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-2xl font-bold text-secondary mb-1">
            {referralStats?.monthlyEarnings}
          </div>
          <div className="text-sm text-muted-foreground">Bulan Ini</div>
        </div>
      </div>
      {/* Referral Code Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 border border-primary/20">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Kode Referral Anda
          </h3>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-background border border-border rounded-lg px-6 py-3 text-xl font-mono font-bold text-primary">
              {referralCode}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Icon name={copied ? "Check" : "Copy"} size={16} className="mr-2" />
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Bagikan kode ini kepada teman dan dapatkan komisi 10% dari setiap pembelian mereka
          </p>
        </div>

        {/* Social Share Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('whatsapp')}
            className="border-green-500/30 text-green-500 hover:bg-green-500/10"
          >
            <Icon name="MessageCircle" size={16} className="mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('telegram')}
            className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
          >
            <Icon name="Send" size={16} className="mr-2" />
            Telegram
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="border-sky-500/30 text-sky-500 hover:bg-sky-500/10"
          >
            <Icon name="Twitter" size={16} className="mr-2" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="border-blue-600/30 text-blue-600 hover:bg-blue-600/10"
          >
            <Icon name="Facebook" size={16} className="mr-2" />
            Facebook
          </Button>
        </div>
      </div>
      {/* Reward Tiers */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Tingkat Reward
        </h3>
        <div className="space-y-4">
          {rewardTiers?.map((tier) => (
            <div key={tier?.id} className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
              tier?.achieved 
                ? 'border-success/30 bg-success/5' 
                : tier?.current 
                  ? 'border-primary/30 bg-primary/5' :'border-border'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tier?.achieved 
                  ? 'bg-success text-white' 
                  : tier?.current 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {tier?.achieved ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <span className="font-bold">{tier?.referrals}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {tier?.referrals} Referral
                  </span>
                  {tier?.achieved && (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  )}
                  {tier?.current && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {referralStats?.referralsNeeded} lagi
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Reward: <span className="text-gaming-gold font-medium">{tier?.reward}</span>
                  {tier?.bonus && (
                    <span className="ml-2">+ {tier?.bonus}</span>
                  )}
                </div>
              </div>
              
              {tier?.current && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(referralStats?.totalReferrals / tier?.referrals) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Recent Referrals */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Referral Terbaru
        </h3>
        <div className="space-y-4">
          {recentReferrals?.map((referral) => (
            <div key={referral?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-primary/30 transition-all duration-200">
              <Image 
                src={referral?.avatar} 
                alt={referral?.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {referral?.username}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    referral?.status === 'active' ?'bg-success/20 text-success' :'bg-warning/20 text-warning'
                  }`}>
                    {referral?.status === 'active' ? 'Aktif' : 'Pending'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Bergabung {referral?.joinedAt}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Pembelian Pertama
                </div>
                <div className="font-semibold text-foreground">
                  {referral?.firstPurchase}
                </div>
                {referral?.commission !== 'Rp 0' && (
                  <div className="text-xs text-success">
                    Komisi: {referral?.commission}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Icon name="Users" size={16} className="mr-2" />
            Lihat Semua Referral
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;