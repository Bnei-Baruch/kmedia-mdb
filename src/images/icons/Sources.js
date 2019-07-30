import React from "react";

const SvgSources = props => (
    <svg fill="none" height="1em" viewBox="0 0 50 50" width="1em" {...props}>
        <g fill="#fff" stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
            <path d="M33 5h5v7.5h-5z" />
            <path
                clipRule="evenodd"
                d="M46 11H4v31h18.667L23 43h4l.333-1H46z"
                fillRule="evenodd"
            />
            <path d="M7 14h36v25H7z" />
            <path d="M7 8h13a5 5 0 0 1 5 5v25.5a4.5 4.5 0 0 0-4.5-4.5H7zM43 8H30a5 5 0 0 0-5 5v25.5a4.5 4.5 0 0 1 4.5-4.5H43z" />
        </g>
    </svg>
);

export default SvgSources;
