import React from 'react';
const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="4" width="16" height="18" rx="2" ry="2"/>
        <line x1="8" y1="9" x2="8.01" y2="9"/>
        <line x1="12" y1="9" x2="12.01" y2="9"/>
        <line x1="16" y1="9" x2="16.01" y2="9"/>
        <line x1="8" y1="13" x2="8.01" y2="13"/>
        <line x1="12" y1="13" x2="12.01" y2="13"/>
        <line x1="16" y1="13" x2="16.01" y2="13"/>
        <line x1="8" y1="17" x2="8.01" y2="17"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
        <line x1="16" y1="17" x2="16.01" y2="17"/>
    </svg>
);
export default BuildingIcon;