import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LiveChat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      sender: "ModeratorWMX",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "Selamat datang di live chat WMX TOPUP! 🎮",
      timestamp: new Date(Date.now() - 300000),
      isModerator: true
    },
    {
      id: 2,
      sender: "GamerPro_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      content: "Ada yang tau event Mobile Legends bulan ini?",
      timestamp: new Date(Date.now() - 240000),
      isModerator: false
    },
    {
      id: 3,
      sender: "MLExpert88",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "Event Ramadan masih berlangsung sampai akhir bulan!",
      timestamp: new Date(Date.now() - 180000),
      isModerator: false
    },
    {
      id: 4,
      sender: "PUBGMaster",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "PUBG Mobile season baru kapan ya?",
      timestamp: new Date(Date.now() - 120000),
      isModerator: false
    },
    {
      id: 5,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
      content: "Halo semua! 👋",
      timestamp: new Date(Date.now() - 60000),
      isModerator: false,
      isOwn: true
    }
  ];

  const onlineUsers = [
    {
      id: 1,
      username: "ModeratorWMX",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "online",
      role: "Moderator"
    },
    {
      id: 2,
      username: "GamerPro_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      status: "online",
      role: "Member"
    },
    {
      id: 3,
      username: "MLExpert88",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "online",
      role: "VIP"
    },
    {
      id: 4,
      username: "PUBGMaster",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "away",
      role: "Member"
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (message?.trim()) {
      const newMessage = {
        id: messages?.length + 1,
        sender: "You",
        avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
        content: message,
        timestamp: new Date(),
        isModerator: false,
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return timestamp?.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Moderator':
        return 'text-red-400';
      case 'VIP':
        return 'text-gaming-gold';
      default:
        return 'text-primary';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Moderator':
        return 'bg-red-500/20 text-red-400';
      case 'VIP':
        return 'bg-gaming-gold/20 text-gaming-gold';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-neon-glow hover:shadow-neon-glow-lg"
        >
          <Icon name="MessageCircle" size={24} />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
            {messages?.length}
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] gaming-card shadow-gaming-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Icon name="MessageCircle" size={24} className="text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Chat</h3>
            <p className="text-xs text-muted-foreground">
              {onlineUsers?.filter(u => u?.status === 'online')?.length} online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            <Icon name="Minimize2" size={16} />
          </Button>
        </div>
      </div>
      {/* Online Users */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Users" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Online ({onlineUsers?.filter(u => u?.status === 'online')?.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onlineUsers?.filter(u => u?.status === 'online')?.map((user) => (
            <div key={user?.id} className="flex items-center space-x-2 bg-muted rounded-full px-2 py-1">
              <Image 
                src={user?.avatar} 
                alt={user?.username}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className={`text-xs font-medium ${getRoleColor(user?.role)}`}>
                {user?.username}
              </span>
              {user?.role !== 'Member' && (
                <span className={`px-1 py-0.5 rounded text-xs font-medium ${getRoleBadge(user?.role)}`}>
                  {user?.role}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages?.map((msg) => (
          <div key={msg?.id} className={`flex space-x-3 ${msg?.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Image 
              src={msg?.avatar} 
              alt={msg?.sender}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className={`flex-1 ${msg?.isOwn ? 'text-right' : ''}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-sm font-medium ${msg?.isModerator ? 'text-red-400' : msg?.isOwn ? 'text-primary' : 'text-foreground'}`}>
                  {msg?.sender}
                </span>
                {msg?.isModerator && (
                  <span className="px-1 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                    MOD
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTime(msg?.timestamp)}
                </span>
              </div>
              <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                msg?.isOwn 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                {msg?.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ketik pesan..."
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!message?.trim()}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Icon name="Send" size={16} />
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Tekan Enter untuk kirim</span>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} />
            <span>Chat dimoderasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;