import * as React from 'react';

function SvgLabelIcon(props) {
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
        d="M1.429 1.756H38.57v42.146H1.43V1.756z"
        fill="#fff"
        stroke="#2185D0"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <path
        d="M8.571 22.83H31.43M20 16.244h11.429M20 9.659h11.429M8.571 29.415H31.43M8.571 36H31.43"
        stroke="#2185D0"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <path
        d="M16.224 17.561H13.47l-1.836-3.512V8.78h5.51v5.268h-2.755l1.836 3.512zm-7.346 0H6.122l-1.836-3.512V8.78h5.51v5.268H7.04l1.837 3.512z"
        fill="#2185D0"
      />
    </svg>
  );
}

export default SvgLabelIcon;
