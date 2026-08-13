import React from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { RegistrationConfirmation } from './pages/RegistrationConfirmation';
import { AdminDashboard } from './pages/AdminDashboard';
import { Team } from './lib/db';

const App: React.FC = () => {
  const getInitialPage = () => {
    const hash = window.location.hash;
    if (hash === '#register') return 'register';
    if (hash === '#admin') return 'admin';
    if (hash === '#confirmation') return 'confirmation';
    return 'home';
  };

  const [currentPage, setCurrentPage] = React.useState<string>(getInitialPage());
  const [registeredTeam, setRegisteredTeam] = React.useState<Team | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      // Clear hash or set to home
      if (window.location.hash === '#register' || window.location.hash === '#admin' || window.location.hash === '#confirmation') {
        window.location.hash = '';
      }
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#register') {
        setCurrentPage('register');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#admin') {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#confirmation') {
        setCurrentPage('confirmation');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
        if (hash && hash !== '#home') {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial scroll check on first mount
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleRegistrationSuccess = (team: Team) => {
    setRegisteredTeam(team);
    setCurrentPage('confirmation');
    window.location.hash = 'confirmation';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between">
      <div>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        
        <main className="pb-12">
          {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
          {currentPage === 'register' && (
            <Register onNavigate={handleNavigate} onSuccess={handleRegistrationSuccess} />
          )}
          {currentPage === 'confirmation' && registeredTeam && (
            <RegistrationConfirmation team={registeredTeam} onNavigate={handleNavigate} />
          )}
          {currentPage === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
        </main>
      </div>

      <footer className="bg-prajna-blue py-6 px-6 text-center text-white border-t border-prajna-blue/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
            PRAJNA 2026 • Mohan Babu University
          </span>
          <span className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} School of Engineering (SoE) & School of Computing (SoC). All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
