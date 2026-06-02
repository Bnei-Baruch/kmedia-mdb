import * as React from 'react';

function SvgAudioBlog(props) {
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
        <path d="M19 27v-6M23 29v-10M27 31v-14M31 29v-10M35 27v-6"/>
      </g>
    </svg>
  );
}

export default SvgAudioBlog;
