import * as React from "react";

function SvgSources(props) {
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
                d="M33 6h5v9h-5z"
                fill="#fff"
                stroke="#2185d0"
                strokeLinecap="square"
                strokeWidth={2}
            />
            <path
                clipRule="evenodd"
                d="M46 13H4v31h18.667L23 45h4l.333-1H46z"
                fill="#fff"
                fillRule="evenodd"
            />
            <path
                d="M4 13v-1H3v1zm42 0h1v-1h-1zM4 44H3v1h1zm18.667 0l.948-.316-.228-.684h-.72zM23 45l-.949.316.228.684H23zm4 0v1h.72l.229-.684zm.333-1v-1h-.72l-.228.684zM46 44v1h1v-1zM4 14h42v-2H4zm1 30V13H3v31zm17.667-1H4v2h18.667zm1.282 1.684l-.334-1-1.897.632.333 1zM27 44h-4v2h4zm-.615-.316l-.334 1 1.898.632.333-1zM46 43H27.333v2H46zm-1-30v31h2V13z"
                fill="#2185d0"
            />
            <g
                fill="#fff"
                stroke="#2185d0"
                strokeLinecap="square"
                strokeWidth={2}
            >
                <path d="M7 16h36v25H7z" />
                <path d="M7 10h13a5 5 0 015 5v25.5a4.5 4.5 0 00-4.5-4.5H7zM43 10H30a5 5 0 00-5 5v25.5a4.5 4.5 0 014.5-4.5H43z" />
            </g>
        </svg>
    );
}

export default SvgSources;
