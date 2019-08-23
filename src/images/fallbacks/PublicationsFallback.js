import React from "react";

const SvgPublicationsFallback = props => (
    <svg fill="none" height="1em" viewBox="0 0 480 270" width="1em" {...props}>
        <path d="M0 0h480v270H0z" fill="#e5e5e5" />
        <path d="M-1636-82h3228v380h-3228z" fill="#fff" />
        <path d="M0 0h480v270H0z" fill="#767676" />
        <g stroke="#5b5b5b" strokeLinecap="square">
            <path
                d="M202 106h28v60h-22a6 6 0 0 1-6-6z"
                fill="#767676"
                strokeWidth={4}
            />
            <path
                d="M214 100h64v60a6 6 0 0 1-6 6h-65 1a6 6 0 0 0 6-6z"
                fill="#767676"
                strokeWidth={4}
            />
            <path
                d="M224 110h44v8h-44zM224 126h8v18h-8zM240 126h28v8h-28z"
                fill="#767676"
                strokeWidth={4}
            />
            <path d="M240 142h28M240 150h28" strokeWidth={4} />
        </g>
    </svg>
);

export default SvgPublicationsFallback;
