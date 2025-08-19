import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = () => {
  const stats = [
    {
      id: 1,
      label: "Active Members",
      value: "125,847",
      change: "+12.5%",
      icon: "Users",
      color: "text-primary"
    },
    {
      id: 2,
      label: "Daily Posts",
      value: "3,247",
      change: "+8.2%",
      icon: "MessageSquare",
      color: "text-secondary"
    },
    {
      id: 3,
      label: "Game Reviews",
      value: "18,592",
      change: "+15.7%",
      icon: "Star",
      color: "text-gaming-gold"
    },
    {
      id: 4,
      label: "Top-up Guides",
      value: "2,156",
      change: "+22.1%",
      icon: "BookOpen",
      color: "text-success"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats?.map((stat) => (
        <div key={stat?.id} className="gaming-card p-6 text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mb-4`}>
            <Icon name={stat?.icon} size={24} className={stat?.color} />
          </div>
          <div className="text-2xl font-gaming font-bold text-foreground mb-1">
            {stat?.value}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {stat?.label}
          </div>
          <div className="text-xs text-success font-medium">
            {stat?.change} dari bulan lalu
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityStats;