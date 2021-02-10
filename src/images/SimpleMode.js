import * as React from "react";

function SvgSimpleMode(props) {
    return (
        <svg
            fill="none"
            height={50}
            width={50}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g
                fill="#fff"
                stroke="#2185d0"
                strokeLinecap="square"
                strokeWidth={2}
            >
                <path d="M7 18h36v26H7z" />
                <path d="M5 16h40v10H5z" />
                <path d="M17 16h16v28H17z" />
            </g>
            <path d="M24 26v4h-2l3 4 3-4h-2v-4z" fill="#2185d0" />
            <path
                d="M24 30v1h1v-1zm0-4v-1h-1v1zm2 0h1v-1h-1zm0 4h-1v1h1zm-4 0v-1h-2l1.2 1.6zm6 0l.8.6L30 29h-2zm-3 4l-.8.6.8 1.067.8-1.067zm0-4v-4h-2v4zm-1-3h2v-2h-2zm1-1v4h2v-4zm-3 5h2v-2h-2zm4 0h2v-2h-2zm-.2 2.4l-3-4-1.6 1.2 3 4zm1.4-4l-3 4 1.6 1.2 3-4z"
                fill="#2185d0"
            />
            <path
                d="M15 6c4 0 9 8 10 10-5 0-14-1-14-6 0-3 2-4 4-4zM35 6c-4 0-9 8-10 10 5 0 14-1 14-6 0-3-2-4-4-4z"
                stroke="#2185d0"
                strokeLinecap="square"
                strokeWidth={2}
            />
        </svg>
    );
}

export default SvgSimpleMode;
