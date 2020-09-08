import * as React from "react";

function SvgEventsFallback(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 480 270"
            width="1em"
            {...props}
        >
            <path d="M0 0h480v270H0z" fill="#e5e5e5" />
            <path d="M-2676-82H552v380h-3228z" fill="#fff" />
            <g fill="#767676">
                <path d="M0 0h480v270H0z" />
                <path
                    d="M200 110h80v60h-80z"
                    stroke="#5b5b5b"
                    strokeLinecap="square"
                    strokeWidth={4}
                />
                <path
                    d="M200 104h80v60h-80z"
                    stroke="#5b5b5b"
                    strokeLinecap="square"
                    strokeWidth={4}
                />
                <path
                    d="M210 96h6v16h-6zM264 96h6v16h-6z"
                    stroke="#5b5b5b"
                    strokeLinecap="square"
                    strokeWidth={4}
                />
            </g>
            <g fill="#767676">
                <path d="M258 122h12v20h-12z" />
                <path d="M222 122h48v10h-48zM210 132h60v10h-60zM210 142h48v10h-48z" />
                <path d="M210 132h12v20h-12zM222 122h12v30h-12zM234 122h12v30h-12zM246 122h12v30h-12z" />
            </g>
            <path
                d="M258 122h12m-12 0v20m0-20h-12m12 0v30m12-30v20m0-20h-48m48 0v10m0 10h-12m12 0v-10m0 10h-60m48 0h-48m48 0v10m-36-30v10m0-10h12m-12 0v30m48-20h-48m48 0h-60m12 0h-12m12 0v20m-12-20v10m0-10v20m0-10v10m48 0h-48m48 0h-12m-36 0h12m0 0h12m0-30v30m0-30h12m-12 30h12m0-30v30"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
        </svg>
    );
}

export default SvgEventsFallback;
