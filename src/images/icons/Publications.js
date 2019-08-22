import React from "react";

const SvgPublications = props => (
    <svg fill="none" height="1em" viewBox="0 0 50 50" width="1em" {...props}>
        <g stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
            <path d="M6 11h14v30H9a3 3 0 01-3-3z" fill="#fff" />
            <path d="M12 8h32v30a3 3 0 01-3 3H8.5 9a3 3 0 003-3z" fill="#fff" />
            <path d="M17 13h22v4H17z" />
            <path d="M17 21h4v9h-4zM25 21h14v4H25z" fill="#fff" />
            <path d="M25 29h14M25 33h14" />
        </g>
    </svg>
);

export default SvgPublications;
