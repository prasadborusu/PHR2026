import React from 'react';
import { Team } from '../lib/db';
import { Award, Printer, Download, CheckCircle, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationConfirmationProps {
  team: Team;
  onNavigate: (page: string) => void;
}

export const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({ team, onNavigate }) => {
  React.useEffect(() => {
    // Premium celebratory micro-animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#DC2626', '#1E3A8A', '#FCFAF2']
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-cream-100 border border-prajna-blue/15 p-8 md:p-12 relative overflow-hidden shadow-md print:shadow-none">
        
        {/* Decorative corner highlights */}
        <div className="absolute top-0 right-0 h-16 w-16 bg-prajna-red/10 rounded-bl-full pointer-events-none print:hidden"></div>
        
        {/* Success Header banner */}
        <div className="text-center pb-8 border-b border-prajna-blue/10">
          <CheckCircle className="h-14 w-14 text-green-600 mx-auto mb-4 print:h-10 print:w-10" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-prajna-red block mb-1">
            CONGRATULATIONS
          </span>
          <h2 className="text-3xl font-serif text-prajna-blue font-bold tracking-tight">
            REGISTRATION SUCCESSFUL
          </h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider">
            PRAJNA 2026 • 36-HOUR HACKATHON
          </p>
        </div>

        {/* Ticket Grid info */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">TEAM ID</span>
              <span className="text-3xl font-mono font-bold text-prajna-red">{team.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">TEAM NAME</span>
              <span className="text-lg font-serif font-bold text-prajna-blue">{team.teamName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">INSTITUTION</span>
              <span className="text-sm font-semibold text-slate-700">{team.college}</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">TEAM MEMBERS</span>
            <ol className="space-y-2">
              {team.members.map((member, index) => (
                <li key={member.id} className="text-xs text-slate-800 bg-cream-50 p-2.5 border border-prajna-blue/5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {index + 1}. {member.name} {index === 0 && <span className="text-[9px] text-prajna-red font-bold uppercase tracking-wider ml-1">(Leader)</span>}
                    </span>
                    <span className="text-[10px] bg-prajna-blue/5 text-prajna-blue px-2 py-0.5 uppercase tracking-wider font-semibold">
                      {member.branch || 'N/A'}
                    </span>
                  </div>
                  {member.rollNumber && (
                    <div className="mt-1 ml-4 text-[10px] text-slate-500 font-mono tracking-wide">
                      Roll No: {member.rollNumber}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Instructions Block */}
        <div className="border-t border-prajna-blue/10 pt-8 space-y-4">
          <h4 className="text-xs font-bold text-prajna-blue uppercase tracking-wider">IMPORTANT GUIDELINES:</h4>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>Keep this ticket configuration safe. Print or download the file for on-site venue entry.</li>
            <li>All team members must carry their official University ID Cards.</li>
            <li>Hackathon Day checklist: Laptops, development kits, chargers, and extensions.</li>
            <li>Problem statements unlock will occur live on the event dashboard.</li>
          </ul>
        </div>

        {/* Form controls */}
        <div className="mt-10 pt-6 border-t border-prajna-blue/10 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-prajna-blue hover:text-prajna-red flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> RETURN TO HOME
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="border border-prajna-blue/20 text-prajna-blue hover:border-prajna-red hover:text-prajna-red text-xs font-bold tracking-widest uppercase py-3 px-6 flex items-center gap-2 transition-colors"
            >
              <Printer className="h-4 w-4" /> PRINT TICKET
            </button>
            
            <button
              onClick={handlePrint}
              className="bg-prajna-blue text-white hover:bg-prajna-blue-hover text-xs font-bold tracking-widest uppercase py-3 px-6 flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" /> DOWNLOAD PDF
            </button>
          </div>
        </div>

        {/* Brand stamp watermark */}
        <div className="mt-8 text-center hidden print:block text-[9px] text-slate-400">
          Generated automatically by PRAJNA Hackathon Registration System • School of Engineering & School of Computing, MBU.
        </div>
      </div>
    </div>
  );
};
