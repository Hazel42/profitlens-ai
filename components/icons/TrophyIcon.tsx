import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M16.5 18.75h-9a9.75 9.75 0 011.09-5.474.75.75 0 011.11-.322l2.68 2.68a.75.75 0 001.11 0l2.68-2.68a.75.75 0 011.11.322 9.75 9.75 0 011.09 5.474z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 12.75h.008v.008H12v-.008z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M4.5 7.5a9 9 0 0115 0v2.25a9 9 0 01-15 0V7.5z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 9.75h16.5" 
    />
  </svg>
);