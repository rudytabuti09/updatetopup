import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Beranda", path: "/homepage-gaming-commerce-hub" },
        { name: "Pilih Game", path: "/game-selection-hub" },
        { name: "Dashboard", path: "/personal-gaming-dashboard" },
        { name: "Komunitas", path: "/gaming-community-portal" }
      ]
    },
    {
      title: "Layanan",
      links: [
        { name: "Top Up Game", path: "/game-selection-hub" },
        { name: "Mobile Gaming", path: "/mobile-gaming-experience" },
        { name: "Checkout", path: "/streamlined-checkout-flow" },
        { name: "Customer Support", path: "#" }
      ]
    },
    {
      title: "Perusahaan",
      links: [
        { name: "Tentang Kami", path: "#" },
        { name: "Karir", path: "#" },
        { name: "Press Kit", path: "#" },
        { name: "Partnership", path: "#" }
      ]
    },
    {
      title: "Bantuan",
      links: [
        { name: "FAQ", path: "#" },
        { name: "Panduan Top Up", path: "#" },
        { name: "Kebijakan Privasi", path: "#" },
        { name: "Syarat & Ketentuan", path: "#" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: "Instagram", url: "#", color: "hover:text-pink-500" },
    { name: "Twitter", icon: "Twitter", url: "#", color: "hover:text-blue-400" },
    { name: "Discord", icon: "MessageSquare", url: "#", color: "hover:text-indigo-400" },
    { name: "YouTube", icon: "Youtube", url: "#", color: "hover:text-red-500" },
    { name: "TikTok", icon: "Music", url: "#", color: "hover:text-pink-400" }
  ];

  const paymentMethods = [
    "Dana", "OVO", "GoPay", "ShopeePay", "Bank Transfer", "Credit Card"
  ];

  const certifications = [
    { name: "SSL Secured", icon: "Shield" },
    { name: "PCI DSS", icon: "CreditCard" },
    { name: "ISO 27001", icon: "Award" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/homepage-gaming-commerce-hub" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Icon name="Zap" size={28} className="text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-gold rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-gaming font-bold text-gaming-gradient">
                  WMX TOPUP
                </span>
                <span className="text-sm text-text-secondary font-accent">
                  Gaming Commerce Hub
                </span>
              </div>
            </Link>

            <p className="text-text-secondary leading-relaxed mb-6 max-w-md">
              Platform top-up gaming terpercaya #1 di Indonesia. Melayani jutaan gamer dengan transaksi aman, cepat, dan terpercaya sejak 2021.
            </p>

            {/* Social Links */}
            <div className="mb-6">
              <h4 className="font-gaming font-bold text-foreground mb-4">Ikuti Kami</h4>
              <div className="flex gap-4">
                {socialLinks?.map((social, index) => (
                  <a
                    key={index}
                    href={social?.url}
                    className={`w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-all duration-200 ${social?.color}`}
                    aria-label={social?.name}
                  >
                    <Icon name={social?.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-text-secondary">
                <Icon name="Mail" size={16} className="text-primary" />
                <span className="text-sm">support@wmxtopup.com</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Icon name="Phone" size={16} className="text-primary" />
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Icon name="Clock" size={16} className="text-primary" />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections?.map((section, index) => (
            <div key={index}>
              <h4 className="font-gaming font-bold text-foreground mb-6">
                {section?.title}
              </h4>
              <ul className="space-y-3">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link?.path}
                      className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Payment & Security Section */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div>
              <h4 className="font-gaming font-bold text-foreground mb-4">
                Metode Pembayaran
              </h4>
              <div className="flex flex-wrap gap-3">
                {paymentMethods?.map((method, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-secondary"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Certifications */}
            <div>
              <h4 className="font-gaming font-bold text-foreground mb-4">
                Keamanan & Sertifikasi
              </h4>
              <div className="flex gap-4">
                {certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon name={cert?.icon} size={16} className="text-success" />
                    <span className="text-sm text-text-secondary">{cert?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-secondary text-sm">
              © {currentYear} WMX TOPUP. All rights reserved. Made with ❤️ for Indonesian Gamers.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <Link to="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-text-secondary text-xs">
              <Icon name="Shield" size={14} className="text-success" />
              <span>Transaksi Anda dilindungi dengan enkripsi SSL 256-bit</span>
              <Icon name="Shield" size={14} className="text-success" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;