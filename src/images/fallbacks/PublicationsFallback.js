import * as React from "react";
const SvgPublicationsFallback = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={480} height={270} fill="none" {...props}>
        <path fill="#e5e5e5" d="M0 0h480v270H0z" />
        <path fill="#fff" d="M-1636-82h3228v380h-3228z" />
        <path fill="#767676" d="M0 0h480v270H0z" />
        <g stroke="#5b5b5b" strokeLinecap="square">
            <path fill="#767676" strokeWidth={4} d="M202 106h28v60h-22a6 6 0 0 1-6-6z" />
            <path fill="#767676" strokeWidth={4} d="M214 100h64v60a6 6 0 0 1-6 6h-65 1a6 6 0 0 0 6-6z" />
            <path fill="#767676" strokeWidth={4} d="M224 110h44v8h-44zM224 126h8v18h-8zM240 126h28v8h-28z" />
            <path strokeWidth={4} d="M240 142h28M240 150h28" />
        </g>
    </svg>
);
export default SvgPublicationsFallback;
