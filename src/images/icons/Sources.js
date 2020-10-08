import * as React from "react";

function SvgSources(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 50 50"
            width="1em"
            {...props}
        >
            <g
                fill="#fff"
                stroke="#2185d0"
                strokeLinecap="square"
                strokeWidth={2}
            >
                <path d="M33 5h5v7.5h-5z" />
                <path
                    clipRule="evenodd"
                    d="M46 11H4v31h18.667L23 43h4l.333-1H46z"
                    fillRule="evenodd"
                />
                <path d="M7 14h36v25H7z" />
                <path d="M7 8h13a5 5 0 015 5v25.5a4.5 4.5 0 00-4.5-4.5H7zM43 8H30a5 5 0 00-5 5v25.5a4.5 4.5 0 014.5-4.5H43z" />
            </g>
        </svg>
    );
}

export default SvgSources;
