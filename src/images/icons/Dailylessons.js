import * as React from 'react';

function SvgDailylessons(props) {
  const { color = '#2185d0' } = props;
  return (
    <svg
      fill="none"
      height="1em"
      viewBox="0 0 50 50"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 6h27v38H8zM40 16h4v25h-4z"
        fill="#fff"
        stroke={color}
        strokeLinecap="square"
        strokeWidth={2}
      />
      <path d="M42 8l2 6v2h-4v-2z" fill="#fff"/>
      <g stroke={color} strokeWidth={2}>
        <path d="M42 6v2m0 0l-2 6v2h4v-2z" strokeLinecap="square"/>
        <path
          d="M40 41h4v2a1 1 0 01-1 1h-2a1 1 0 01-1-1z"
          fill="#fff"
          strokeLinecap="square"
        />
        <path d="M5 15h6M5 11h6M5 19h6M5 23h6M5 27h6M5 31h6M5 35h6M5 39h6"/>
      </g>
    </svg>
  );
}

export default SvgDailylessons;
