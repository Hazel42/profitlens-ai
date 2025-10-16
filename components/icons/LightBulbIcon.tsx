import React from 'react';

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.628 6.01 6.01 0 00-3 0 6.01 6.01 0 001.5 11.628v5.25zM12 15a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 014.5 0v5.25A2.25 2.25 0 0112 15zm-2.25-6.75h4.5" 
    />
  </svg>
);
