import * as React from 'react';

function SvgLikutim(props) {
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
        <path d="M10 12h26v32H10z" fill="#fff"/>
        <path d="M14 8h26v32H14z" fill="#fff"/>
        <path d="M22 11.5v6a1.5 1.5 0 01-3 0V8a3 3 0 116 0M19 24h16M27 19h8M27 14h8M19 29h16M19 34h16"/>
      </g>
    </svg>
  );
}

export default SvgLikutim;
