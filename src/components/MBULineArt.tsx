import React from 'react';

export const MBULineArt: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 800 350" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Mohan Babu University building architectural line-art sketch"
    >
      {/* Sky/Perspective accents */}
      <path d="M 50 60 L 750 60" stroke="#1E3A8A" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.4" />
      <path d="M 50 300 L 750 300" stroke="#1E3A8A" strokeWidth="0.5" opacity="0.3" />

      {/* Main Building Background Outline (Central dome and wings) */}
      <path d="M 120 300 L 120 180 L 250 180 L 250 120 L 320 120 L 320 100 L 480 100 L 480 120 L 550 120 L 550 180 L 680 180 L 680 300 Z" stroke="#DC2626" strokeWidth="1" opacity="0.4" />

      {/* Classical Portico columns and pillars (Left Wing) */}
      <line x1="140" y1="180" x2="140" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="160" y1="180" x2="160" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="180" y1="180" x2="180" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="200" y1="180" x2="200" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="220" y1="180" x2="220" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="240" y1="180" x2="240" y2="300" stroke="#475569" strokeWidth="1" />

      {/* Classical Portico columns and pillars (Right Wing) */}
      <line x1="560" y1="180" x2="560" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="580" y1="180" x2="580" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="600" y1="180" x2="600" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="620" y1="180" x2="620" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="640" y1="180" x2="640" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="660" y1="180" x2="660" y2="300" stroke="#475569" strokeWidth="1" />

      {/* Central grand entrance arch & steps */}
      <path d="M 350 300 L 350 200 C 350 160 450 160 450 200 L 450 300" stroke="#1E3A8A" strokeWidth="2" className="animate-line" />
      <path d="M 370 300 L 370 210 C 370 180 430 180 430 210 L 430 300" stroke="#DC2626" strokeWidth="1" />
      
      {/* Front Steps */}
      <line x1="330" y1="300" x2="470" y2="300" stroke="#1E3A8A" strokeWidth="1.5" />
      <line x1="320" y1="305" x2="480" y2="305" stroke="#1E3A8A" strokeWidth="1.5" />
      <line x1="310" y1="310" x2="490" y2="310" stroke="#1E3A8A" strokeWidth="1.5" />

      {/* Dome structure at the top */}
      <path d="M 360 100 C 360 50 440 50 440 100 Z" stroke="#1E3A8A" strokeWidth="1.5" fill="#FCFAF2" fillOpacity="0.8" />
      {/* Dome spire */}
      <line x1="400" y1="50" x2="400" y2="25" stroke="#DC2626" strokeWidth="2" />
      <circle cx="400" cy="23" r="3" fill="#DC2626" />

      {/* Modern university windows grids */}
      {/* Left building block */}
      <rect x="130" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="170" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="210" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="130" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="170" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="210" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />

      {/* Right building block */}
      <rect x="570" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="610" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="650" y="195" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="570" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="610" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />
      <rect x="650" y="235" width="20" height="25" rx="2" stroke="#1E3A8A" strokeWidth="0.75" />

      {/* Central tower details */}
      <line x1="320" y1="120" x2="480" y2="120" stroke="#1E3A8A" strokeWidth="2" />
      <rect x="350" y="135" width="100" height="15" rx="1" stroke="#DC2626" strokeWidth="1" />
      <text x="400" y="146" fill="#1E3A8A" fontSize="10" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">MBU</text>

      {/* Decorative architectural grid lines */}
      <line x1="80" y1="300" x2="720" y2="300" stroke="#1E3A8A" strokeWidth="2" />
      <path d="M 100 300 Q 110 320 120 300" stroke="#DC2626" strokeWidth="0.5" />
      <path d="M 680 300 Q 690 320 700 300" stroke="#DC2626" strokeWidth="0.5" />
    </svg>
  );
};
