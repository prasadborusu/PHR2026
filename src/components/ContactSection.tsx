import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-cream-50 border-t border-prajna-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block mb-2">Reach Out</span>
            <h2 className="text-3xl font-serif text-prajna-blue font-bold mb-4">CONTACT ORGANIZERS</h2>
            <div className="w-12 h-1 bg-prajna-red mb-6"></div>
            <p className="text-slate-600 mb-8 max-w-md">
              Have questions regarding eligibility, rules, or campus permissions? Our organizing coordinators are here to assist.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cream-100 border border-prajna-blue/5">
                  <Mail className="h-5 w-5 text-prajna-red" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">Email Address</h4>
                <a href="mailto:prajna@mbu.asia" className="text-prajna-blue hover:text-prajna-red transition-colors text-sm font-semibold">
                    prajna@mbu.asia
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-cream-100 border border-prajna-blue/5">
                  <Phone className="h-5 w-5 text-prajna-blue" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">Helpline Numbers</h4>
                  <div className="text-slate-700 text-sm font-semibold">
                    +91 877 2237270 (SoE) <br />
                    +91 877 2237276 (SoC)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-cream-100 border border-prajna-blue/5">
                  <MapPin className="h-5 w-5 text-prajna-red" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">Venue Address</h4>
                  <p className="text-slate-700 text-sm leading-relaxed max-w-xs">
                    Mohan Babu University, Yerpedu-Tirupati Road, Sree Sainath Nagar, Tirupati, Andhra Pradesh - 517102.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-prajna-blue/10 p-8 bg-cream-100 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-prajna-red block mb-2">School Affiliation</span>
              <h3 className="text-xl font-serif text-prajna-blue font-semibold mb-4">MOHAN BABU UNIVERSITY</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Established as a center of educational excellence, Mohan Babu University promotes interdisciplinary computing and engineering breakthroughs to cultivate future technology leaders.
              </p>
            </div>
            
            <div className="border-t border-prajna-blue/5 pt-6 flex flex-col gap-3">
              <a 
                href="https://www.mbu.asia" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-semibold text-prajna-blue hover:text-prajna-red flex items-center gap-1.5 self-start"
              >
                Go to MBU Portal <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-[10px] text-slate-400 block mt-2">
                © {new Date().getFullYear()} School of Engineering & School of Computing, MBU.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
