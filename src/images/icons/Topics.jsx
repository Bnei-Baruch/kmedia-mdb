import * as React from 'react';

function SvgTopics(props) {
  const { color = '#2185d0' } = props;
  return (
    <svg
      fill="none"
      height="1em"
      viewBox="0 0 50 50"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props }
    >
      <path
        d="M19 18h26v26H19z"
        fill="#fff"
        stroke={color}
        strokeLinecap="square"
        strokeWidth={2}
      />
      <path
        d="M31.334 21.549c.21-.645 1.122-.645 1.332 0l2.028 6.243h6.564c.678 0 .96.867.412 1.266l-5.31 3.858 2.027 6.243c.21.645-.528 1.181-1.077.783L32 36.084l-5.31 3.858c-.55.398-1.287-.138-1.078-.783l2.029-6.243-5.31-3.858c-.55-.399-.268-1.266.41-1.266h6.565z"
        fill={color}
      />
      <path
        d="M6 6h26v26H6z"
        fill="#fff"
        stroke={color}
        strokeLinecap="square"
        strokeWidth={2}
      />
      <path d="M22.429 16h-6l-.858 6h6z" fill="#fff" />
      <path
        d="M13 16h13M15 26l2-14m-5 10h13m-4 4l2-14"
        stroke={color}
        strokeLinecap="square"
        strokeWidth={2}
      />
    </svg>
  );
}

export default SvgTopics;
