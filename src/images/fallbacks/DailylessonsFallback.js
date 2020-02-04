import React from "react";

function SvgDailylessonsFallback(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 480 270"
            width="1em"
            {...props}
        >
            <path d="M0 0h480v270H0z" fill="#e5e5e5" />
            <path d="M-76-82h3228v380H-76z" fill="#fff" />
            <path d="M0 0h480v270H0z" fill="#767676" />
            <path
                d="M208 96h54v76h-54zM272 114h8v50h-8z"
                fill="#767676"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
            <path d="M276 100l4 10v4h-8v-4z" fill="#767676" />
            <path
                d="M276 96v4m0 0l-4 10v4h8v-4z"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
            <g stroke="#5b5b5b">
                <path
                    d="M272 164h8v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z"
                    fill="#767676"
                    strokeLinecap="square"
                    strokeWidth={4}
                />
                <path
                    d="M202 106h12M202 114h12M202 122h12M202 130h12M202 138h12M202 146h12M202 154h12M202 162h12"
                    strokeWidth={4}
                />
            </g>
        </svg>
    );
}

export default SvgDailylessonsFallback;
