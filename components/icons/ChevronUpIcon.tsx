
import React from 'react';

const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    // FIX: Removed extra '24' from the attributes list which was causing a parsing error.
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m18 15-6-6-6 6"/>
    </svg>
);

export default ChevronUpIcon;