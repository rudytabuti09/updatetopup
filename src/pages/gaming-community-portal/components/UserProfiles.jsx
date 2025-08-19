import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const UserProfiles = () => {
  const topMembers = [
    {
      id: 1,
      username: "GamingLegend_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      level: 47,
      title: "Elite Gamer",
      totalSpent: "Rp 15.750.000",
      achievements: 89,
      posts: 1247,
      reputation: 9.8,
      badges: ["Top Spender", "Community Helper", "Game Expert"],
      favoriteGames: ["Mobile Legends", "PUBG Mobile", "Genshin Impact"]
    },
    {
      id: 2,
      username: "MLProPlayer88",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      level: 42,
      title: "MOBA Master",
      totalSpent: "Rp 12.340.000",
      achievements: 76,
      posts: 892,
      reputation: 9.5,
      badges: ["ML Champion", "Strategy Guide", "Active Member"],
      favoriteGames: ["Mobile Legends", "Arena of Valor", "Wild Rift"]
    },
    {
      id: 3,
      username: "PUBGSniper_Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      level: 39,
      title: "Battle Royale King",
      totalSpent: "Rp 9.890.000",
      achievements: 64,
      posts: 567,
      reputation: 9.2,
      badges: ["PUBG Expert", "Weapon Master", "Team Player"],
      favoriteGames: ["PUBG Mobile", "Free Fire", "Call of Duty Mobile"]
    }
  ];

  const getLevelProgress = (level) => {
    return ((level % 10) / 10) * 100;
  };

  const getBadgeColor = (badge) => {
    const colors = {
      "Top Spender": "bg-gaming-gold text-black",
      "Community Helper": "bg-success text-white",
      "Game Expert": "bg-primary text-black",
      "ML Champion": "bg-purple-500 text-white",
      "Strategy Guide": "bg-blue-500 text-white",
      "Active Member": "bg-green-500 text-white",
      "PUBG Expert": "bg-orange-500 text-white",
      "Weapon Master": "bg-red-500 text-white",
      "Team Player": "bg-cyan-500 text-white"
    };
    return colors?.[badge] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Member Terbaik
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          Lihat Leaderboard
        </button>
      </div>
      <div className="space-y-6">
        {topMembers?.map((member, index) => (
          <div key={member?.id} className="border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start space-x-4">
              {/* Rank Badge */}
              <div className="relative">
                <Image 
                  src={member?.avatar} 
                  alt={member?.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                />
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-gaming-gold text-black' :
                  index === 1 ? 'bg-gray-400 text-black': 'bg-amber-600 text-white'
                }`}>
                  {index + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* User Info */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {member?.username}
                    </h3>
                    <p className="text-sm text-gaming-gold font-medium">
                      {member?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Level</div>
                    <div className="text-xl font-bold text-primary">{member?.level}</div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress ke Level {member?.level + 1}</span>
                    <span>{Math.round(getLevelProgress(member?.level))}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getLevelProgress(member?.level)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{member?.totalSpent}</div>
                    <div className="text-xs text-muted-foreground">Total Top-up</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{member?.achievements}</div>
                    <div className="text-xs text-muted-foreground">Achievement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{member?.posts}</div>
                    <div className="text-xs text-muted-foreground">Post Forum</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Star" size={16} className="text-gaming-gold" />
                      <span className="text-lg font-bold text-foreground">{member?.reputation}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Reputasi</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Badge:</div>
                  <div className="flex flex-wrap gap-2">
                    {member?.badges?.map((badge, badgeIndex) => (
                      <span 
                        key={badgeIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Favorite Games */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Game Favorit:</div>
                  <div className="flex flex-wrap gap-2">
                    {member?.favoriteGames?.map((game, gameIndex) => (
                      <span 
                        key={gameIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary"
                      >
                        <Icon name="Gamepad2" size={12} className="mr-1" />
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Profiles */}
      <div className="text-center mt-6">
        <button className="btn-gaming-secondary px-6 py-3">
          <Icon name="Users" size={16} className="mr-2" />
          Lihat Semua Member
        </button>
      </div>
    </div>
  );
};

export default UserProfiles;