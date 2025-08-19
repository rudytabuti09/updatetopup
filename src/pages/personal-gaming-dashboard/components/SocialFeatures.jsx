import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SocialFeatures = ({ friends, achievements, challenges }) => {
  const [activeTab, setActiveTab] = useState('friends');

  const tabs = [
    { id: 'friends', label: 'Teman', icon: 'Users', count: friends?.length },
    { id: 'achievements', label: 'Pencapaian', icon: 'Trophy', count: achievements?.filter(a => a?.unlocked)?.length },
    { id: 'challenges', label: 'Tantangan', icon: 'Target', count: challenges?.filter(c => c?.active)?.length }
  ];

  const renderFriends = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">Teman Gaming ({friends?.length})</h4>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="UserPlus" size={16} className="mr-2" />
          Tambah Teman
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends?.map((friend) => (
          <div
            key={friend?.id}
            className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={friend?.avatar}
                  alt={friend?.name}
                  className="w-12 h-12 rounded-full border-2 border-border"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                  friend?.isOnline ? 'bg-success' : 'bg-muted'
                }`}></div>
              </div>
              <div>
                <h5 className="font-medium text-foreground">{friend?.name}</h5>
                <p className="text-sm text-text-secondary">
                  {friend?.isOnline ? 'Online' : `Terakhir ${friend?.lastSeen}`}
                </p>
                <p className="text-xs text-text-secondary">
                  Level {friend?.level} • {friend?.favoriteGame}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 p-2"
              >
                <Icon name="MessageCircle" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 p-2"
              >
                <Icon name="Gift" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">
          Pencapaian ({achievements?.filter(a => a?.unlocked)?.length}/{achievements?.length})
        </h4>
        <div className="flex items-center space-x-2">
          <div className="w-32 bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(achievements?.filter(a => a?.unlocked)?.length / achievements?.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-text-secondary">
            {Math.round((achievements?.filter(a => a?.unlocked)?.length / achievements?.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((achievement) => (
          <div
            key={achievement?.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              achievement?.unlocked
                ? 'bg-gradient-to-br from-gaming-gold/20 to-primary/20 border-gaming-gold/30 shadow-neon-glow'
                : 'bg-surface border-border opacity-60'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                achievement?.unlocked
                  ? 'bg-gaming-gold text-black' :'bg-muted text-text-secondary'
              }`}>
                <Icon name={achievement?.icon} size={24} />
              </div>
              <h5 className={`font-semibold mb-1 ${
                achievement?.unlocked ? 'text-gaming-gold' : 'text-text-secondary'
              }`}>
                {achievement?.title}
              </h5>
              <p className="text-sm text-text-secondary mb-2">
                {achievement?.description}
              </p>
              {achievement?.unlocked ? (
                <div className="text-xs text-success">
                  Dibuka pada {achievement?.unlockedDate}
                </div>
              ) : (
                <div className="text-xs text-text-secondary">
                  Progress: {achievement?.progress}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">
          Tantangan Aktif ({challenges?.filter(c => c?.active)?.length})
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Ikuti Tantangan
        </Button>
      </div>

      <div className="space-y-4">
        {challenges?.filter(c => c?.active)?.map((challenge) => (
          <div
            key={challenge?.id}
            className="p-4 bg-surface rounded-lg border border-border hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name={challenge?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">{challenge?.title}</h5>
                  <p className="text-sm text-text-secondary">{challenge?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gaming-gold">
                  {challenge?.reward}
                </div>
                <div className="text-xs text-text-secondary">
                  Berakhir {challenge?.endDate}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Progress</span>
                <span className="text-foreground">
                  {challenge?.currentProgress}/{challenge?.targetProgress}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(challenge?.currentProgress / challenge?.targetProgress) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {challenge?.participants} peserta
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Lihat Detail
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="Users" size={24} className="text-primary mr-3" />
          Komunitas Gaming
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Share2" size={16} className="mr-2" />
          Bagikan Profil
        </Button>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="text-sm font-medium">{tab?.label}</span>
            {tab?.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab?.id
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-primary/20 text-primary'
              }`}>
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div>
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'challenges' && renderChallenges()}
      </div>
    </div>
  );
};

export default SocialFeatures;