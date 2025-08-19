import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import CommunityStats from './components/CommunityStats';
import TrendingDiscussions from './components/TrendingDiscussions';
import GameForums from './components/GameForums';
import UserProfiles from './components/UserProfiles';
import Leaderboards from './components/Leaderboards';
import GamingNews from './components/GamingNews';
import UserGeneratedContent from './components/UserGeneratedContent';
import ReferralProgram from './components/ReferralProgram';
import LiveChat from './components/LiveChat';

const GamingCommunityPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Icon name="Users" size={16} className="mr-2" />
              Komunitas Gaming Terbesar Indonesia
            </div>
            <h1 className="text-4xl lg:text-6xl font-gaming font-bold text-gaming-gradient mb-6">
              Gaming Community
              <span className="block text-foreground">Portal</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Bergabunglah dengan komunitas gamer Indonesia terbesar. Diskusi strategi, berbagi tips, 
              dan dapatkan insight terbaru dari para ahli gaming.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-gaming-primary">
                <Icon name="MessageSquare" size={18} className="mr-2" />
                Mulai Diskusi
              </button>
              <button className="btn-gaming-secondary">
                <Icon name="Trophy" size={18} className="mr-2" />
                Lihat Leaderboard
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <CommunityStats />
        </div>
      </section>
      {/* Main Content */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <TrendingDiscussions />
              <GameForums />
              <GamingNews />
              <UserGeneratedContent />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <UserProfiles />
              <Leaderboards />
              <ReferralProgram />
            </div>
          </div>
        </div>
      </section>
      {/* Community Guidelines */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Icon name="Shield" size={16} className="mr-2" />
            Komunitas yang Aman & Positif
          </div>
          <h2 className="text-3xl font-gaming font-bold text-foreground mb-6">
            Pedoman Komunitas
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Kami berkomitmen menciptakan lingkungan yang aman, positif, dan mendukung 
            untuk semua anggota komunitas gaming Indonesia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gaming-card p-6 text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={24} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Saling Menghormati
              </h3>
              <p className="text-sm text-muted-foreground">
                Hormati sesama gamer tanpa memandang skill level atau preferensi game
              </p>
            </div>
            
            <div className="gaming-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="MessageSquare" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Diskusi Konstruktif
              </h3>
              <p className="text-sm text-muted-foreground">
                Berikan feedback yang membangun dan hindari flame atau toxic behavior
              </p>
            </div>
            
            <div className="gaming-card p-6 text-center">
              <div className="w-12 h-12 bg-gaming-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} className="text-gaming-gold" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Berbagi Pengetahuan
              </h3>
              <p className="text-sm text-muted-foreground">
                Bagikan tips, strategi, dan pengalaman untuk membantu sesama gamer
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="btn-gaming-secondary">
              <Icon name="FileText" size={18} className="mr-2" />
              Baca Pedoman Lengkap
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={24} className="text-black" />
                </div>
                <div>
                  <span className="text-xl font-gaming font-bold text-gaming-gradient">
                    WMX TOPUP
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Gaming Community Portal
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Platform komunitas gaming terdepan di Indonesia. Bergabunglah dengan ribuan 
                gamer lainnya untuk berbagi pengalaman dan strategi gaming terbaik.
              </p>
              <div className="flex items-center space-x-4">
                <button className="w-10 h-10 bg-muted hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                  <Icon name="Facebook" size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="w-10 h-10 bg-muted hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                  <Icon name="Twitter" size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="w-10 h-10 bg-muted hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                  <Icon name="Instagram" size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="w-10 h-10 bg-muted hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                  <Icon name="Youtube" size={20} className="text-muted-foreground hover:text-primary" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Komunitas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Forum Diskusi</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Event & Turnamen</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Program Referral</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Dukungan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Hubungi Kami</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pedoman Komunitas</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Laporkan Masalah</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} WMX TOPUP. Semua hak dilindungi.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-primary transition-colors">Syarat Layanan</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default GamingCommunityPortal;