import React from 'react';
import { Award, Layers, Users, BookOpen } from 'lucide-react';

interface StatsSectionProps {
  hours: number;
  teams: number;
  participants: number;
  projects: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  hours,
  teams,
  participants,
  projects
}) => {
  const [counts, setCounts] = React.useState({
    hoursCount: 0,
    teamsCount: 0,
    participantsCount: 0,
    projectsCount: 0
  });

  React.useEffect(() => {
    // Simple animated counters
    const duration = 1500; // 1.5s
    const steps = 30;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounts({
        hoursCount: Math.min(Math.round((hours / steps) * currentStep), hours),
        teamsCount: Math.min(Math.round((teams / steps) * currentStep), teams),
        participantsCount: Math.min(Math.round((participants / steps) * currentStep), participants),
        projectsCount: Math.min(Math.round((projects / steps) * currentStep), projects)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [hours, teams, participants, projects]);

  const statItems = [
    { label: '36 HOURS', value: `${counts.hoursCount}h`, desc: 'Continuous Hackathon', icon: <Layers className="h-6 w-6 text-prajna-red" /> },
    { label: '100+ TEAMS', value: counts.teamsCount, desc: 'Across Branches', icon: <Users className="h-6 w-6 text-prajna-blue" /> },
    { label: '500+ PARTICIPANTS', value: counts.participantsCount, desc: 'Engaged Innovators', icon: <BookOpen className="h-6 w-6 text-prajna-red" /> },
    { label: '150+ PROJECTS', value: counts.projectsCount, desc: 'Interdisciplinary Solutions', icon: <Award className="h-6 w-6 text-prajna-blue" /> }
  ];

  return (
    <section id="about" className="py-20 bg-cream-100 border-y border-prajna-blue/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {/* Subtle grid lines background pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 min-[600px]:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          <div>
            <span className="text-prajna-red font-semibold tracking-wider text-[9px] sm:text-xs uppercase block mb-2">Academic Excellence</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-prajna-blue font-bold mb-4 lg:mb-6">
              ABOUT PRAJNA HACKATHON
            </h2>
            <div className="w-12 h-1 bg-prajna-red mb-4 lg:mb-6"></div>
            <p className="text-slate-700 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-4">
              PRAJNA is the flagship 36-hour interdisciplinary hackathon organized jointly by Mohan Babu University's School of Engineering (SoE) and School of Computing (SoC).
            </p>
            <p className="text-slate-755 text-[10px] sm:text-xs md:text-sm leading-relaxed">
              Designed as a collaborative ecosystem, PRAJNA challenges 3rd and 4th year students to form cross-functional cohorts, validating real-world challenges through technology. By requiring diverse academic branches and gender-balanced teams, we ensure rich perspectives and highly viable project prototypes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {statItems.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-cream-50 p-3.5 sm:p-6 border border-prajna-blue/10 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-prajna-red/20 group"
              >
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  {item.icon}
                  <span className="w-1.5 h-1.5 rounded-full bg-prajna-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-prajna-blue font-serif mb-1">{item.value}</div>
                <div className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest font-semibold text-prajna-red mb-2">{item.label}</div>
                <div className="text-slate-500 text-[8px] sm:text-[10px] md:text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
