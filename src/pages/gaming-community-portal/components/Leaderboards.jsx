import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const Leaderboards = () => {
  const [activeLeaderboard, setActiveLeaderboard] = useState('spenders');

  const leaderboardTypes = [
    { id: 'spenders', name: 'Top Spenders', icon: 'CreditCard' },
    { id: 'active', name: 'Most Active', icon: 'MessageSquare' },
    { id: 'challenges', name: 'Seasonal Challenges', icon: 'Trophy' }
  ];

  const topSpenders = [
    {
      id: 1,
      rank: 1,
      username: "DiamondKing_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      amount: "Rp 25.750.000",
      change: "+2",
      badge: "Platinum Elite",
      monthlySpent: "Rp 3.200.000"
    },
    {
      id: 2,
      rank: 2,
      username: "GamingWhale88",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      amount: "Rp 22.340.000",
      change: "-1",
      badge: "Gold Elite",
      monthlySpent: "Rp 2.890.000"
    },
    {
      id: 3,
      rank: 3,
      username: "TopUpMaster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      amount: "Rp 19.890.000",
      change: "+1",
      badge: "Silver Elite",
      monthlySpent: "Rp 2.450.000"
    },
    {
      id: 4,
      rank: 4,
      username: "MLLegend_Pro",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      amount: "Rp 17.650.000",
      change: "0",
      badge: "Bronze Elite",
      monthlySpent: "Rp 2.100.000"
    },
    {
      id: 5,
      rank: 5,
      username: "PUBGChampion",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
      amount: "Rp 15.320.000",
      change: "+3",
      badge: "Rising Star",
      monthlySpent: "Rp 1.890.000"
    }
  ];

  const mostActive = [
    {
      id: 1,
      rank: 1,
      username: "CommunityHelper",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      posts: 2847,
      likes: 15420,
      badge: "Community Leader",
      weeklyPosts: 89
    },
    {
      id: 2,
      rank: 2,
      username: "GameGuruID",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      posts: 2156,
      likes: 12890,
      badge: "Expert Contributor",
      weeklyPosts: 67
    },
    {
      id: 3,
      rank: 3,
      username: "StrategyMaster",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
      posts: 1934,
      likes: 11230,
      badge: "Strategy Expert",
      weeklyPosts: 54
    }
  ];

  const seasonalChallenges = [
    {
      id: 1,
      rank: 1,
      username: "ChallengeKing",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      points: 15420,
      completedChallenges: 89,
      badge: "Challenge Master",
      currentStreak: 45
    },
    {
      id: 2,
      rank: 2,
      username: "QuestHunter_ID",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      points: 13890,
      completedChallenges: 76,
      badge: "Quest Expert",
      currentStreak: 32
    },
    {
      id: 3,
      rank: 3,
      username: "AchievementPro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      points: 12340,
      completedChallenges: 68,
      badge: "Achievement Hunter",
      currentStreak: 28
    }
  ];

  const getCurrentData = () => {
    switch (activeLeaderboard) {
      case 'spenders':
        return topSpenders;
      case 'active':
        return mostActive;
      case 'challenges':
        return seasonalChallenges;
      default:
        return topSpenders;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-gaming-gold';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return 'Crown';
      case 2:
        return 'Medal';
      case 3:
        return 'Award';
      default:
        return 'Hash';
    }
  };

  const getChangeColor = (change) => {
    if (change?.startsWith('+')) return 'text-success';
    if (change?.startsWith('-')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Leaderboard
        </h2>
        <div className="text-sm text-muted-foreground">
          Update terakhir: 19 Agustus 2025, 17:00 WIB
        </div>
      </div>
      {/* Leaderboard Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        {leaderboardTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => setActiveLeaderboard(type?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeLeaderboard === type?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={type?.icon} size={16} />
            <span>{type?.name}</span>
          </button>
        ))}
      </div>
      {/* Leaderboard Content */}
      <div className="space-y-4">
        {getCurrentData()?.map((user) => (
          <div key={user?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12">
              <Icon 
                name={getRankIcon(user?.rank)} 
                size={24} 
                className={getRankColor(user?.rank)}
              />
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4 flex-1">
              <Image 
                src={user?.avatar} 
                alt={user?.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {user?.username}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {user?.badge}
                  </span>
                </div>
                
                {/* Stats based on leaderboard type */}
                {activeLeaderboard === 'spenders' && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Total: <span className="text-foreground font-medium">{user?.amount}</span></span>
                    <span>Bulan ini: <span className="text-foreground font-medium">{user?.monthlySpent}</span></span>
                  </div>
                )}
                
                {activeLeaderboard === 'active' && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Posts: <span className="text-foreground font-medium">{user?.posts}</span></span>
                    <span>Likes: <span className="text-foreground font-medium">{user?.likes}</span></span>
                    <span>Minggu ini: <span className="text-foreground font-medium">{user?.weeklyPosts}</span></span>
                  </div>
                )}
                
                {activeLeaderboard === 'challenges' && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Points: <span className="text-foreground font-medium">{user?.points}</span></span>
                    <span>Completed: <span className="text-foreground font-medium">{user?.completedChallenges}</span></span>
                    <span>Streak: <span className="text-foreground font-medium">{user?.currentStreak}</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Rank Change */}
            {activeLeaderboard === 'spenders' && (
              <div className="flex items-center space-x-2">
                {user?.change !== '0' && (
                  <Icon 
                    name={user?.change?.startsWith('+') ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className={getChangeColor(user?.change)}
                  />
                )}
                <span className={`text-sm font-medium ${getChangeColor(user?.change)}`}>
                  {user?.change === '0' ? '-' : user?.change}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Rewards Section */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Gift" size={24} className="text-gaming-gold" />
          <h3 className="text-lg font-semibold text-foreground">Hadiah Leaderboard</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gaming-gold font-bold">Juara 1</div>
            <div className="text-muted-foreground">Voucher Rp 500.000 + Badge Eksklusif</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 font-bold">Juara 2</div>
            <div className="text-muted-foreground">Voucher Rp 300.000 + Badge</div>
          </div>
          <div className="text-center">
            <div className="text-amber-600 font-bold">Juara 3</div>
            <div className="text-muted-foreground">Voucher Rp 200.000 + Badge</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;