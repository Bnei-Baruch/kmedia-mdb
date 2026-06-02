import * as React from 'react';

function SvgPublications(props) {
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
        <path d="M6 13h14v31H9a3 3 0 01-3-3z" fill="#fff"/>
        <path
          d="M12 10h32v31a3 3 0 01-3 3H8.5 9a3 3 0 003-3z"
          fill="#fff"
        />
        <path d="M17 16h22v4H17z" fill="#2185d0"/>
        <path d="M17 25h4v9h-4zM25 25h14v4H25z" fill="#fff"/>
        <path d="M25 33h14M25 37h14"/>
      </g>
    </svg>
  );
}

export default SvgPublications;
