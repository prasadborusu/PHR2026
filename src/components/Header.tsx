import React from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { dbService } from '../lib/db';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenRegistration, setIsOpenRegistration] = React.useState(true);

  React.useEffect(() => {
    const handleUpdate = (config: any) => {
      setIsOpenRegistration(config.status === 'OPEN');
    };

    // Initial load
    dbService.getEventConfig().then(handleUpdate);

    // Subscribe to realtime database updates
    const unsubscribe = dbService.subscribeToEventConfig(handleUpdate);

    // Fallback polling for localStorage (useful if Supabase is offline or not configured)
    const interval = setInterval(() => {
      dbService.getEventConfig().then((config) => {
        setIsOpenRegistration((prev) => {
          const next = config.status === 'OPEN';
          return prev !== next ? next : prev;
        });
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'HOME', value: 'home', hash: '#home' },
    { label: 'ABOUT', value: 'home', hash: '#about' },
    { label: 'PAST PRAJNA', value: 'home', hash: '#past-prajna' },
    { label: 'WINNERS', value: 'home', hash: '#winners' },
    { label: 'MEMORIES', value: 'home', hash: '#memories' },
    { label: 'FAQ', value: 'home', hash: '#faq' },
    { label: 'CONTACT', value: 'home', hash: '#contact' },
  ];

  const handleLinkClick = (page: string, hash: string) => {
    setIsOpen(false);
    if (currentPage !== page) {
      onNavigate(page);
    }
    window.location.hash = hash;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-prajna-blue/10 py-3 sm:py-4 px-4 sm:px-6 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Brand Identity */}
          <div 
            onClick={() => handleLinkClick('home', '#home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center transition-all duration-300">
              <img 
                src="/mbulogo.jpg" 
                alt="Mohan Babu University Logo" 
                className="h-11 sm:h-14 md:h-16 w-auto object-contain bg-transparent" 
              />
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.value, link.hash)}
                className="text-xs font-bold tracking-widest text-prajna-blue hover:text-prajna-red relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-prajna-red after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </button>
            ))}
            
            <button
              onClick={() => onNavigate('admin')}
              className="text-[10px] font-bold tracking-widest text-slate-500 hover:text-prajna-blue border border-slate-300 hover:border-prajna-blue px-3 py-1 transition-all"
            >
              ADMIN
            </button>
          </nav>

          {/* Desktop & Tablet CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isOpenRegistration ? (
              <button
                onClick={() => onNavigate('register')}
                className="bg-prajna-red text-white text-[11px] font-bold tracking-widest uppercase py-2.5 px-5 hover:bg-prajna-red-hover transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                REGISTER NOW <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                disabled
                className="bg-slate-300 text-slate-500 cursor-not-allowed text-[11px] font-bold tracking-widest uppercase py-2.5 px-5 flex items-center gap-2 border border-slate-300"
              >
                REGISTRATION CLOSED
              </button>
            )}
          </div>

          {/* Mobile Navigation Trigger & Compact Register Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isOpenRegistration ? (
              <button
                onClick={() => onNavigate('register')}
                className="sm:hidden bg-prajna-red text-white text-[10px] font-bold tracking-wider uppercase py-2 px-3 hover:bg-prajna-red-hover transition-colors flex items-center gap-1 shadow-sm"
              >
                REGISTER <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <button
                disabled
                className="sm:hidden bg-slate-300 text-slate-500 cursor-not-allowed text-[10px] font-bold tracking-wider uppercase py-2 px-3 flex items-center gap-1 border border-slate-300"
              >
                CLOSED
              </button>
            )}

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 border border-prajna-blue/15 hover:border-prajna-red rounded-sm bg-cream-100 text-prajna-blue focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5 text-prajna-red" /> : <Menu className="h-5 w-5 text-prajna-blue" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop & Menu (Outside header to avoid backdrop-filter fixed position bug) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex flex-col justify-start">
          {/* Spacer to push menu down below sticky header height */}
          <div className="h-[68px] sm:h-[88px] w-full shrink-0"></div>
          
          <div className="bg-cream-50 border-b border-prajna-blue/15 p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.value, link.hash)}
                  className="text-xs font-bold tracking-widest text-prajna-blue hover:text-prajna-red text-left py-3 px-3 rounded-md hover:bg-cream-200 transition-colors flex items-center justify-between border-b border-prajna-blue/5"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </button>
              ))}
              
              <button
                onClick={() => { onNavigate('admin'); setIsOpen(false); }}
                className="text-xs font-bold tracking-widest text-slate-600 hover:text-prajna-blue text-left py-3 px-3 rounded-md hover:bg-cream-200 transition-colors flex items-center justify-between border-b border-prajna-blue/5 mt-1"
              >
                <span>ADMIN PORTAL</span>
                <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">SECURE</span>
              </button>
            </div>

            <div className="pt-2">
              {isOpenRegistration ? (
                <button
                  onClick={() => { onNavigate('register'); setIsOpen(false); }}
                  className="w-full bg-prajna-red text-white text-xs font-bold tracking-widest uppercase py-3.5 px-5 text-center hover:bg-prajna-red-hover transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  REGISTER TEAM FOR PRAJNA 2026 <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-300 text-slate-500 cursor-not-allowed text-xs font-bold tracking-widest uppercase py-3.5 px-5 text-center flex items-center justify-center gap-2"
                >
                  REGISTRATIONS CLOSED
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
