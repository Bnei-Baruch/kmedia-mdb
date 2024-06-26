import * as React from 'react';

function SvgPlaylistAdd(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      viewBox="0 0 23 24"
      width="100%"
      fill="#000"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z"/>
    </svg>
  );
}

export default SvgPlaylistAdd;
