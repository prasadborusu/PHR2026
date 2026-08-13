import React from 'react';
import { dbService, ProblemStatement } from '../lib/db';
import { 
  Download,
  Unlock,
  Lock
} from 'lucide-react';

export const ProblemStatements: React.FC = () => {
  const [problems, setProblems] = React.useState<ProblemStatement[]>([]);
  const [released, setReleased] = React.useState(false);

  React.useEffect(() => {
    dbService.getProblems().then((data) => {
      setProblems(data);
      const anyPublished = data.some(p => p.status === 'PUBLISHED');
      setReleased(anyPublished);
    });
  }, []);

  const publishedProblems = problems.filter(p => p.status === 'PUBLISHED');

  return (
    <section id="problems" className="py-20 bg-cream-50 relative border-b border-prajna-blue/10">
      <div className="absolute inset-0 bg-[radial-gradient(#e2d9c2_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Released Problem Statements Section */}
        {released && publishedProblems.length > 0 ? (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <span className="text-green-600 font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-1 mb-2">
                <Unlock className="h-4 w-4" /> LIVE CHALLENGES
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-prajna-blue font-bold uppercase tracking-tight">
                PROBLEM STATEMENTS ARE RELEASED
              </h3>
              <div className="w-12 h-1 bg-prajna-red mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="bg-cream-100 p-6 border border-prajna-blue/15 hover:border-prajna-red/30 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-serif font-bold text-prajna-blue mb-3 pt-2">{prob.category}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">{prob.description}</p>
                  </div>

                  <div className="border-t border-prajna-blue/5 pt-4 flex flex-col gap-3">
                    {prob.fileUrl ? (
                      <a
                        href={prob.fileUrl}
                        download={prob.fileName || 'problem_statement_document'}
                        className="w-full bg-prajna-blue hover:bg-prajna-blue-hover text-white text-[11px] font-bold uppercase tracking-wider py-2.5 transition-colors border border-prajna-blue/15 flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" /> DOWNLOAD PROBLEM STATEMENTS
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center font-medium italic">
                        No additional attachments
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center">
            <div className="border border-prajna-red/20 bg-prajna-red/[0.02] p-12 text-center relative overflow-hidden rounded">
              <Lock className="h-12 w-12 text-prajna-red mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-bold font-serif text-prajna-blue mb-2 uppercase tracking-wide">
                🔒 Problem Statements Locked
              </h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                Detailed problem challenges will be released live on Hackathon Day. Stay tuned for the administrator unlock!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
