import React from 'react';
import { MBULineArt } from '../components/MBULineArt';
import { dbService, EventConfig, PastEdition } from '../lib/db';
import { StatsSection } from '../components/StatsSection';
import { WinnersSection } from '../components/WinnersSection';
import { MemoriesGallery } from '../components/MemoriesGallery';
import { ProblemStatements } from '../components/ProblemStatements';
import { FAQSection } from '../components/FAQSection';
import { ContactSection } from '../components/ContactSection';
import { ArrowRight, Calendar, MapPin, Award, Layers } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [config, setConfig] = React.useState<EventConfig | null>(null);
  const [pastEditions, setPastEditions] = React.useState<PastEdition[]>([]);

  React.useEffect(() => {
    // Initial load
    dbService.getEventConfig().then(setConfig);
    dbService.getPastEditions().then(setPastEditions);

    // Subscribe to realtime database updates
    const unsubscribe = dbService.subscribeToEventConfig((updated) => {
      setConfig((prev) => {
        if (!prev || JSON.stringify(prev) !== JSON.stringify(updated)) {
          return updated;
        }
        return prev;
      });
    });

    // Fallback polling for localStorage (useful if Supabase is offline or not configured)
    const interval = setInterval(() => {
      dbService.getEventConfig().then((latest) => {
        setConfig((prev) => {
          if (!prev || JSON.stringify(prev) !== JSON.stringify(latest)) {
            return latest;
          }
          return prev;
        });
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (!config) return null;

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div id="home">
      {/* Hero Section */}
      <section className="relative bg-cream-50 flex items-center pt-2 pb-2 sm:pt-4 sm:pb-4 overflow-hidden border-b border-prajna-blue/10">
        <div className="absolute inset-0 bg-[radial-gradient(#e2d9c2_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

        <div className="w-full grid grid-cols-12 gap-4 lg:gap-8 items-center relative z-10 px-4 sm:px-8 md:pl-16 md:pr-4">
          {/* Hero Content */}
          <div className="col-span-7 lg:col-span-4 space-y-4 sm:space-y-6 flex flex-col items-start text-left py-2 sm:py-6 lg:pl-12">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold text-prajna-blue tracking-tight leading-none animate-fade-in">
                PRAJNA
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold text-prajna-red tracking-tight leading-none animate-fade-in delay-100">
                2026
              </h1>
            </div>

            <div className="space-y-2 sm:space-y-3 w-full">
              <h2 className="text-base sm:text-2xl md:text-3xl font-sans font-extrabold text-prajna-blue tracking-wider">
                36-HOUR HACKATHON
              </h2>
              
              {/* Ornaments line block from mockup */}
              <div className="flex items-center justify-start gap-2 sm:gap-3 text-prajna-red font-bold text-[9px] sm:text-sm tracking-widest uppercase">
                <span className="h-[2px] w-3 sm:w-6 bg-prajna-red inline-block"></span>
                <span>INTERDISCIPLINARY PROJECTS</span>
                <span className="h-[2px] w-3 sm:w-6 bg-prajna-red inline-block"></span>
              </div>
            </div>

            <p className="text-slate-600 text-[10px] sm:text-sm leading-relaxed max-w-sm font-medium">
              An interdisciplinary hackathon where students come together to build, innovate and solve meaningful problems.
            </p>

            <div className="pt-1 sm:pt-2 w-full flex justify-start">
              {config.status === 'OPEN' ? (
                <button
                  onClick={() => onNavigate('register')}
                  className="bg-prajna-red text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2.5 px-6 sm:py-3.5 sm:px-10 hover:bg-prajna-red-hover transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow active:scale-95"
                >
                  REGISTER NOW <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  disabled
                  className="bg-slate-300 text-slate-500 cursor-not-allowed text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2.5 px-6 sm:py-3.5 sm:px-10 flex items-center justify-center gap-2"
                >
                  REGISTRATION CLOSED
                </button>
              )}
            </div>

            {/* Mobile/Tablet Dates & Venue Block */}
            <div className="lg:hidden bg-prajna-blue/95 border-l-4 border-prajna-red p-3.5 text-white text-[8px] sm:text-[10px] uppercase font-bold tracking-wider space-y-2.5 w-full shadow-md backdrop-blur-sm rounded-r">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-prajna-red shrink-0" />
                <span>DATES: {formatDate(config.startDate).toUpperCase()} - {formatDate(config.endDate).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-prajna-red shrink-0" />
                <span>VENUE: {config.venue.toUpperCase()}</span>
              </div>
            </div>

            {/* Desktop Quick Metadata Block (Hidden on mobile) */}
            <div className="hidden lg:grid grid-cols-2 gap-6 sm:gap-8 pt-4 sm:pt-5 border-t border-prajna-blue/10 w-full max-w-sm justify-items-start">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-prajna-red shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">STATUS</span>
                  <span className="text-xs font-bold text-prajna-blue">COMING SOON</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-prajna-red shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">VENUE</span>
                  <span className="text-xs font-bold text-prajna-blue">{config.venue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Architectural Building Photo/Illustration (Fills right side completely) */}
          <div className="col-span-5 lg:col-span-8 relative w-full h-[200px] min-[500px]:h-[300px] lg:h-[840px] xl:h-[900px] flex items-center justify-center lg:items-end lg:justify-end">
            <img 
              src="/landing.png" 
              alt="Mohan Babu University Academic Building" 
              className="max-w-full max-h-full object-contain object-center lg:object-right-bottom scale-105 lg:scale-110 origin-bottom-right transition-all duration-700" 
            />
          </div>
        </div>
      </section>

      {/* Date & Venue Sticky Ribbon */}
      <div className="hidden lg:block bg-prajna-blue py-3.5 px-4 sm:px-6 text-white border-y border-prajna-blue-hover">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-prajna-red shrink-0" />
            <span>Hackathon Dates: {formatDate(config.startDate)} - {formatDate(config.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-prajna-red shrink-0" />
            <span>Venue: {config.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-prajna-red shrink-0" />
            <span>Deadline: {formatDate(config.deadline)}</span>
          </div>
        </div>
      </div>

      {/* Problem Statements Section */}
      <ProblemStatements />

      {/* About PRAJNA Stats Section */}
      <StatsSection
        hours={config.hoursCount}
        teams={config.teamsCount}
        participants={config.participantsCount}
        projects={config.projectsCount}
      />

      {/* Past PRAJNA Editions */}
      <section id="past-prajna" className="py-20 bg-cream-50 relative border-b border-prajna-blue/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block mb-2">Previous Chapters</span>
            <h2 className="text-3xl md:text-4xl font-serif text-prajna-blue font-bold mb-4">PAST EDITIONS</h2>
            <div className="w-12 h-1 bg-prajna-red mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEditions.map((ed) => (
              <div 
                key={ed.id}
                className="bg-cream-100 border border-prajna-blue/10 p-8 text-center group hover:border-prajna-red/40 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-prajna-blue text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  EDITION
                </div>
                
                <h3 className="text-3xl font-serif font-bold text-prajna-blue mt-4 mb-6">PRAJNA {ed.year}</h3>
                
                <div className="grid grid-cols-2 gap-4 border-y border-prajna-blue/5 py-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">TEAMS</span>
                    <span className="text-lg font-bold text-slate-700">{ed.teams}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">PARTICIPANTS</span>
                    <span className="text-lg font-bold text-slate-700">{ed.participants}</span>
                  </div>
                </div>

                <a 
                  href="#memories" 
                  className="text-xs font-bold text-prajna-red group-hover:text-prajna-blue transition-colors flex items-center justify-center gap-1.5"
                >
                  {ed.linkText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Winners Section */}
      <WinnersSection />

      {/* Photo Memories Gallery */}
      <MemoriesGallery />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Final Call To Action */}
      <section className="py-24 bg-cream-100 text-center relative border-t border-prajna-blue/10 overflow-hidden">
        {/* Subtle architectural bottom elements */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-5 pointer-events-none w-full max-w-4xl">
          <MBULineArt className="w-full h-auto" />
        </div>

        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-6">
          <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block">READY TO BUILD?</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-prajna-blue">Your 36-hour journey starts here.</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Bring your prototype concepts to life and present them to leading academic and industry jury panels.
          </p>

          <div className="pt-4">
            {config.status === 'OPEN' ? (
              <button
                onClick={() => onNavigate('register')}
                className="bg-prajna-red text-white text-xs font-bold tracking-widest uppercase py-4 px-10 hover:bg-prajna-red-hover transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                REGISTER NOW <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="bg-slate-200 border border-slate-300 text-slate-500 font-bold uppercase tracking-wider py-4 px-10 inline-block text-xs">
                REGISTRATIONS ARE CURRENTLY CLOSED
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Footer */}
      <ContactSection />
    </div>
  );
};
