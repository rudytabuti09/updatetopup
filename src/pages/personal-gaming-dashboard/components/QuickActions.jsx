import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickActions = ({ favoriteGames, onGameSelect }) => {
  const quickActionItems = [
    { icon: 'CreditCard', label: 'Top Up Cepat', action: 'quick-topup' },
    { icon: 'Gift', label: 'Klaim Reward', action: 'claim-rewards' },
    { icon: 'Users', label: 'Ajak Teman', action: 'invite-friends' },
    { icon: 'Settings', label: 'Pengaturan', action: 'settings' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <h2 className="text-xl font-gaming font-bold text-foreground mb-6 flex items-center">
        <Icon name="Zap" size={24} className="text-primary mr-3" />
        Aksi Cepat
      </h2>
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActionItems?.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-20 flex-col space-y-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
            onClick={() => console.log(`Action: ${item?.action}`)}
          >
            <Icon name={item?.icon} size={24} className="text-primary" />
            <span className="text-sm font-medium">{item?.label}</span>
          </Button>
        ))}
      </div>
      {/* Favorite Games */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Game Favorit</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favoriteGames?.map((game) => (
            <div
              key={game?.id}
              onClick={() => onGameSelect(game)}
              className="group cursor-pointer bg-surface rounded-lg p-4 border border-border hover:border-primary/40 hover:shadow-neon-blue transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <Image
                    src={game?.icon}
                    alt={game?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Star" size={10} className="text-black fill-current" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {game?.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {game?.lastTopup}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;