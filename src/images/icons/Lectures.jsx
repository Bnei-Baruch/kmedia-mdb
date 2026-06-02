import * as React from 'react';

function SvgLectures(props) {
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
        <path d="M5 10h40M5 33h40M25 33v3"/>
        <circle cx={25} cy={38} fill="#fff" r={2}/>
        <path d="M11 44.5L25 18l14 26.5"/>
        <path d="M7 10h36v23H7z" fill="#fff"/>
      </g>
    </svg>
  );
}

export default SvgLectures;
