import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rizky Pratama",
      username: "@rizkygaming",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      game: "Mobile Legends",
      rank: "Mythical Glory",
      rating: 5,
      review: `WMX TOPUP benar-benar game changer! Dulu saya sering khawatir top-up di tempat lain karena takut akun kena suspend. Di sini prosesnya cepat banget, cuma 20 detik diamond udah masuk. Customer servicenya juga responsif 24/7. Udah 2 tahun jadi member dan gak pernah kecewa!`,
      achievement: "Top Global Gusion",
      totalSpent: "Rp 2.5M+",
      memberSince: "2022",
      verified: true
    },
    {
      id: 2,
      name: "Sari Dewi",
      username: "@sarigamer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      game: "Free Fire",
      rank: "Grandmaster",
      rating: 5,
      review: `Sebagai working mom yang suka gaming, WMX TOPUP sangat membantu. Bisa top-up kapan aja tanpa ribet, bahkan tengah malam sekalipun. Harganya juga kompetitif dan sering ada promo menarik. Yang paling saya suka, ada notifikasi WhatsApp jadi gak perlu cek-cek terus.`,
      achievement: "Squad Leader",
      totalSpent: "Rp 1.8M+",
      memberSince: "2023",
      verified: true
    },
    {
      id: 3,
      name: "Ahmad Fauzi",
      username: "@fauzipromax",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      game: "PUBG Mobile",
      rank: "Conqueror",
      rating: 5,
      review: `Udah coba berbagai platform top-up, tapi WMX TOPUP yang paling reliable. Sistem keamanannya top notch, pernah ada transaksi yang gagal langsung direfund otomatis. Tim supportnya juga paham gaming, jadi komunikasinya nyambung. Recommended banget untuk para gamers!`,
      achievement: "Season 20 Conqueror",
      totalSpent: "Rp 3.2M+",
      memberSince: "2021",
      verified: true
    },
    {
      id: 4,
      name: "Maya Sinta",
      username: "@mayagenshin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      game: "Genshin Impact",
      rank: "AR 58",
      rating: 5,
      review: `Genshin Impact butuh crystal yang lumayan mahal, tapi di WMX TOPUP sering ada bonus dan cashback. Prosesnya juga aman, gak pernah ada masalah dengan akun miHoYo saya. Plus ada program loyalitas yang memberikan poin reward, jadi makin hemat untuk top-up selanjutnya.`,
      achievement: "C6 Raiden Shogun",
      totalSpent: "Rp 4.1M+",
      memberSince: "2022",
      verified: true
    }
  ];

  const stats = [
    {
      label: "Rating Rata-rata",
      value: "4.9/5",
      icon: "Star",
      color: "text-gaming-gold"
    },
    {
      label: "Total Review",
      value: "25,847",
      icon: "MessageSquare",
      color: "text-primary"
    },
    {
      label: "Kepuasan Customer",
      value: "98.7%",
      icon: "ThumbsUp",
      color: "text-success"
    },
    {
      label: "Repeat Customer",
      value: "94.2%",
      icon: "Repeat",
      color: "text-secondary"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="MessageSquare" size={20} className="text-primary" />
            <span className="text-primary font-accent font-bold uppercase tracking-wider text-sm">
              Testimonials
            </span>
            <Icon name="MessageSquare" size={20} className="text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gradient mb-6">
            Kata Mereka Tentang Kami
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Dengarkan pengalaman langsung dari jutaan gamer Indonesia yang sudah mempercayai WMX TOPUP
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="gaming-card p-6 hover:border-primary/40 transition-all duration-300">
                <Icon name={stat?.icon} size={32} className={`${stat?.color} mx-auto mb-3`} />
                <div className={`text-2xl font-gaming font-bold ${stat?.color} mb-1`}>
                  {stat?.value}
                </div>
                <div className="text-text-secondary text-sm">
                  {stat?.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <div className="gaming-card p-8 md:p-12 border border-primary/20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* User Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-neon-blue mx-auto lg:mx-0">
                      <Image 
                        src={testimonials?.[activeTestimonial]?.avatar} 
                        alt={testimonials?.[activeTestimonial]?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {testimonials?.[activeTestimonial]?.verified && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <Icon name="Check" size={16} className="text-black" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-gaming font-bold text-foreground mb-1">
                      {testimonials?.[activeTestimonial]?.name}
                    </h3>
                    <p className="text-primary text-sm mb-2">
                      {testimonials?.[activeTestimonial]?.username}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={16} 
                          className="text-gaming-gold" 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Icon name="Gamepad2" size={14} className="text-secondary" />
                      <span className="text-text-secondary">Game:</span>
                      <span className="text-foreground font-medium">{testimonials?.[activeTestimonial]?.game}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Icon name="Trophy" size={14} className="text-gaming-gold" />
                      <span className="text-text-secondary">Rank:</span>
                      <span className="text-foreground font-medium">{testimonials?.[activeTestimonial]?.rank}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Icon name="Award" size={14} className="text-primary" />
                      <span className="text-text-secondary">Achievement:</span>
                      <span className="text-foreground font-medium">{testimonials?.[activeTestimonial]?.achievement}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <Icon name="Quote" size={32} className="text-primary/30 mb-4" />
                    <p className="text-lg leading-relaxed text-foreground">
                      {testimonials?.[activeTestimonial]?.review}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-gaming font-bold text-primary">
                        {testimonials?.[activeTestimonial]?.totalSpent}
                      </div>
                      <div className="text-xs text-text-secondary">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-gaming font-bold text-secondary">
                        {testimonials?.[activeTestimonial]?.memberSince}
                      </div>
                      <div className="text-xs text-text-secondary">Member Since</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-gaming font-bold text-gaming-gold">
                        VIP
                      </div>
                      <div className="text-xs text-text-secondary">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
            >
              <Icon name="ChevronLeft" size={20} className="text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === activeTestimonial 
                      ? 'bg-primary shadow-neon-blue' 
                      : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
            >
              <Icon name="ChevronRight" size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* All Reviews CTA */}
        <div className="text-center mt-12">
          <div className="gaming-card p-6 inline-block">
            <p className="text-text-secondary mb-4">
              Ingin membaca lebih banyak review dari gamer lain?
            </p>
            <button className="btn-gaming-secondary">
              <Icon name="ExternalLink" size={18} className="mr-2" />
              Lihat Semua Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;