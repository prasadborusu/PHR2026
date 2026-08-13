import React from 'react';
import { dbService, Memory } from '../lib/db';
import { Maximize2, X, Plus } from 'lucide-react';

export const MemoriesGallery: React.FC = () => {
  const [memories, setMemories] = React.useState<Memory[]>([]);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [lightboxImage, setLightboxImage] = React.useState<Memory | null>(null);

  React.useEffect(() => {
    dbService.getMemories().then(setMemories);

    const unsubscribe = dbService.subscribeToMemories ? dbService.subscribeToMemories((latest) => {
      setMemories(latest);
    }) : () => {};

    return () => {
      unsubscribe();
    };
  }, []);

  if (memories.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(memories.map(m => m.category)))];

  const filteredMemories = activeCategory === 'All' 
    ? memories 
    : memories.filter(m => m.category === activeCategory);

  return (
    <section id="memories" className="py-20 bg-cream-100 border-y border-prajna-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-prajna-red font-semibold tracking-wider text-xs uppercase block mb-2">Visual Archives</span>
            <h2 className="text-3xl md:text-4xl font-serif text-prajna-blue font-bold mb-4">MEMORIES</h2>
            <div className="w-12 h-1 bg-prajna-red mb-6"></div>
          </div>
          
          {/* Category Filter list */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  activeCategory === cat 
                    ? 'bg-prajna-red text-white border-prajna-red' 
                    : 'bg-cream-50 text-prajna-blue border-prajna-blue/15 hover:border-prajna-red/45'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMemories.map((item) => (
            <div 
              key={item.id}
              className="bg-cream-50 border border-prajna-blue/10 overflow-hidden relative group cursor-pointer"
              onClick={() => setLightboxImage(item)}
            >
              <div className="w-full h-64 overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-prajna-blue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold text-prajna-red-light tracking-widest">{item.category}</span>
                  <h4 className="text-white font-serif font-semibold text-sm mt-1 flex justify-between items-center">
                    {item.title}
                    <Maximize2 className="h-4 w-4 text-white/80" />
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn">
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
            aria-label="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img 
              src={lightboxImage.imageUrl} 
              alt={lightboxImage.title} 
              className="max-w-full max-h-[75vh] object-contain border border-white/10"
            />
            <div className="text-center mt-4 text-white">
              <span className="text-xs uppercase tracking-widest text-prajna-red font-semibold">{lightboxImage.category}</span>
              <h3 className="text-lg font-serif mt-1 font-semibold">{lightboxImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
