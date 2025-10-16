import React from 'react';

export const MegaphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15h8.25a7.5 7.5 0 000-15H10.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 7.5v.75m0 3.75v.75M9 13.5v-3m0 3h.008v.008H9v-.008zm0-3h.008v.008H9v-.008z" />
  </svg>
);
