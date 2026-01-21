import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Layers, Briefcase, Mail, User, ChevronDown, Github, DockIcon, Pipette, Paperclip, BookDashedIcon, LineChart, MonitorPlayIcon, MonitorCog, AlertCircle, PipetteIcon, MonitorDot, GalleryHorizontalEnd } from 'lucide-react';
import Logo from '../../assets/logo.png';

// Types
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: { label: string; icon: React.ReactNode; href: string; }[];
}

// NavLink Component
interface NavLinkProps {
  item: NavItem;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, mobile, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (item.submenu) {
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  return (
    <div className={mobile ? 'w-full' : 'relative group'}>
      <a
        href={item.href}
        onClick={(e) => {
          if (item.submenu) e.preventDefault();
          handleClick();
        }}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl
          bg-emerald-950/30 hover:bg-emerald-950/50 
          border border-emerald-800/10 hover:border-emerald-700/20
          backdrop-blur-xl transition-all duration-300
          text-emerald-100/70 hover:text-emerald-50
          shadow-lg shadow-black/20 hover:shadow-emerald-950/30
          ${mobile ? 'w-full justify-between' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-emerald-400/80">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-900/40 text-emerald-300/90 border border-emerald-800/30">
              {item.badge}
            </span>
          )}
        </div>
        {item.submenu && (
          <ChevronDown 
            className={`w-4 h-4 text-emerald-400/50 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </a>

      {item.submenu && (
        <div className={`
          ${mobile ? 'ml-4 mt-2' : 'absolute top-full left-0 mt-2 min-w-[200px]'}
          ${mobile && isOpen ? 'block' : mobile ? 'hidden' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}
          transition-all duration-300
        `}>
          {item.submenu.map((subitem, i) => (
            <a
              key={i}
              href={subitem.href}
              onClick={onClick}
              className="block px-4 py-2.5 rounded-xl mb-1.5
                bg-emerald-950/30 hover:bg-emerald-950/50
                border border-emerald-800/10 hover:border-emerald-700/20
                backdrop-blur-xl transition-all duration-200
                text-emerald-100/60 hover:text-emerald-50 text-sm
                flex gap-1 items-center"
            >
              {subitem.icon} {subitem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// MobileMenu Component
interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw] sm:w-96 sm:max-w-[75vw] z-50 lg:hidden
        bg-gradient-to-br from-black/98 via-emerald-950/95 to-black/98
        backdrop-blur-2xl border-l border-emerald-800/15
        shadow-2xl shadow-black/50
        transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-emerald-800/20">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400/90 via-emerald-300/80 to-emerald-500/90 bg-clip-text text-transparent">
              <img src={Logo} alt="Logo" className="w-25 h-8" />
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-2xl
                bg-emerald-950/40 hover:bg-emerald-900/40
                border border-emerald-800/20 hover:border-emerald-700/30
                text-emerald-400/80 hover:text-emerald-300
                transition-all duration-300 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item, i) => (
              <NavLink key={i} item={item} mobile onClick={onClose} />
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-emerald-800/20">
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-emerald-900/30 border border-emerald-800/20">
              <p className="text-xs text-emerald-300/60 text-center">
                Design by SafePay
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Navbar Component Props
export interface NavbarProps {
  logoSrc?: string;
  navItems?: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  logoSrc,
  navItems
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavItems: NavItem[] = [
    { 
      label: 'Home', 
      href: '/', 
      icon: <Home className="w-5 h-5" />,
      badge: 'New'
    },
    { 
      label: 'Monitoramento', 
      href: '/transactions-monitor', 
      icon: <MonitorDot className="w-5 h-5" />,
    },
    { 
      label: 'Transações', 
      href: '/transactions', 
      icon: <GalleryHorizontalEnd className="w-5 h-5" />,
    },
    { 
      label: 'Alertas',
      href: '/alerts', 
      icon: <AlertCircle className="w-5 h-5" />,
    },
    { 
      label: 'GitHub', 
      href: 'https://github.com/henriquepierandrei/safepay', 
      icon: <Github className="w-5 h-5" />
    },
    { 
      label: 'Docs', 
      href: '/docs', 
      icon: <Paperclip  className="w-5 h-5" />
    }
  ];

  const items = navItems || defaultNavItems;

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-30 transition-all duration-500
        ${scrolled ? 'py-3' : 'py-4 sm:py-6'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`
            flex items-center justify-between
            bg-black/50 backdrop-blur-2xl
            border border-emerald-800/15
            rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4
            shadow-2xl shadow-black/50
            transition-all duration-500
            ${scrolled ? 'shadow-black/70' : ''}
          `}>
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br p-2.5 shadow-lg  group-hover:transition-all duration-300">
                {logoSrc ? (
                  <img 
                    src={logoSrc}
                    alt="Logo" 
                    className="w-full h-full object-contain scale-300 ml-8"
                  />
                ) : (
                  <img 
                    src={Logo}
                    alt="Logo" 
                    className="w-full h-full object-contain scale-300 ml-8"
                  />
                )}
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {items.map((item, i) => (
                <NavLink key={i} item={item} />
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl
                bg-emerald-950/40 hover:bg-emerald-900/40
                border border-emerald-800/20 hover:border-emerald-700/30
                text-emerald-400/80 hover:text-emerald-300
                transition-all duration-300 active:scale-95"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        navItems={items} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 78, 59, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 78, 59, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 78, 59, 0.5);
        }
      `}</style>
    </>
  );
};

export default Navbar;