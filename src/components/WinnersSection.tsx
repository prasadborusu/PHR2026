import React from 'react';
import { dbService, Winner } from '../lib/db';
import { Award, Medal, Trophy } from 'lucide-react';

export const WinnersSection: React.FC = () => {
  const [winners, setWinners] = React.useState<Winner[]>([]);

  React.useEffect(() => {
    dbService.getWinners().then(setWinners);

    const unsubscribe = dbService.subscribeToWinners ? dbService.subscribeToWinners((latest) => {
      setWinners(latest);
    }) : () => {};

    return () => {
      unsubscribe();
    };
  }, []);

  const getPositionIcon = (pos: string) => {
    switch (pos.toLowerCase()) {
      case 'winner':
        return <Trophy className="h-6 w-6 text-amber-500" />;
      case 'runner up':
        return <Medal className="h-6 w-6 text-slate-400" />;
      default:
        return <Award className="h-6 w-6 text-bronze-500 text-amber-700" />;
    }
  };

  const getPositionStyles = (pos: string) => {
    switch (pos.toLowerCase()) {
      case 'winner':
        return 'border-amber-500/20 bg-amber-500/[0.02]';
      case 'runner up':
        return 'border-slate-400/20 bg-slate-400/[0.02]';
      default:
        return 'border-amber-700/20 bg-amber-700/[0.02]';
    }
  };

  if (winners.length === 0) return null;

  return (
    <section id="winners" className="py-20 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block mb-2">Hall of Fame</span>
          <h2 className="text-3xl md:text-4xl font-serif text-prajna-blue font-bold mb-4">MEET THE WINNERS</h2>
          <div className="w-12 h-1 bg-prajna-red mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-xl mx-auto">
            Celebrating outstanding innovation and execution from previous cohorts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className={`border p-6 relative group transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${getPositionStyles(winner.position)}`}
            >
              {winner.imageUrl && (
                <div className="w-full h-48 overflow-hidden mb-6 border border-prajna-blue/5">
                  <img
                    src={winner.imageUrl}
                    alt={winner.projectName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-prajna-red block mb-1">
                    {winner.year} EDITION
                  </span>
                  <h3 className="text-lg font-bold text-prajna-blue font-serif">{winner.projectName}</h3>
                </div>
                <div className="p-2 bg-cream-100 border border-prajna-blue/5">
                  {getPositionIcon(winner.position)}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase block">TEAM</span>
                <span className="text-sm font-semibold text-slate-800">{winner.teamName}</span>
                <span className="text-xs text-slate-500 block mt-1">{winner.department}</span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase block">MEMBERS</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {winner.members.map((member, i) => (
                    <span key={i} className="text-xs bg-cream-200 text-prajna-blue px-2 py-0.5 border border-prajna-blue/5">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed border-t border-prajna-blue/5 pt-4">
                {winner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
