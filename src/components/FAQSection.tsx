import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What are the team eligibility requirements?',
      answer: 'A team must have exactly 4 members. At least 1 member must be a woman. The team must represent at least 2 different academic branches/departments, and only 3rd-year and 4th-year students are eligible to participate.'
    },
    {
      question: 'Can students from other colleges register?',
      answer: 'PRAJNA 2026 is primarily an inter-departmental university challenge for Mohan Babu University students. However, inter-college collaborations are allowed as long as academic year and gender rules are strictly satisfied.'
    },
    {
      question: 'When will the problem statements be released?',
      answer: 'Problem statements will be unlocked live on Hackathon Day. During registration, you do not need to choose a track. The release is controlled by the admin panel on the day of the event.'
    },
    {
      question: 'Are hardware projects allowed?',
      answer: 'Yes! PRAJNA encourages interdisciplinary innovations spanning Software, Hardware co-design, Smart Grids, AR/VR, Agriculture Tech, and AI. Lab space and resources will be provided.'
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No, registration is completely free for all eligible Mohan Babu University student cohorts.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-cream-100 border-t border-prajna-blue/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block mb-2">Help Center</span>
          <h2 className="text-3xl md:text-4xl font-serif text-prajna-blue font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="w-12 h-1 bg-prajna-red mx-auto mb-6"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-cream-50 border border-prajna-blue/10 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center font-serif font-semibold text-prajna-blue hover:text-prajna-red transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm md:text-base">
                    <HelpCircle className="h-5 w-5 text-prajna-red flex-shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-prajna-blue" /> : <ChevronDown className="h-4 w-4 text-prajna-blue" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs md:text-sm border-t border-prajna-blue/5 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
