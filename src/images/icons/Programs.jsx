import * as React from 'react';

function SvgPrograms(props) {
  return (
    <svg
      fill="none"
      height="1em"
      viewBox="0 0 50 50"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
        <path d="M4 15h42v23H4z" fill="#fff"/>
        <path d="M4 10h42v25H4z" fill="#fff"/>
        <path d="M37 44H13M25 44v-6"/>
      </g>
    </svg>
  );
}

export default SvgPrograms;
