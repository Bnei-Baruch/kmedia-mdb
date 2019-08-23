import React from "react";

const SvgSourcesFallback = props => (
    <svg fill="none" height="1em" viewBox="0 0 480 270" width="1em" {...props}>
        <path d="M0 0h480v270H0z" fill="#e5e5e5" />
        <path d="M-2156-82h3228v380h-3228z" fill="#fff" />
        <g fill="#767676">
            <path d="M0 0h480v270H0z" />
            <path
                d="M256 96h10v15h-10z"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
            <path
                clipRule="evenodd"
                d="M282 108h-84v62h37.333l.667 2h8l.667-2H282z"
                fillRule="evenodd"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
            <path
                d="M204 114h72v50h-72z"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
            <path
                d="M204 102h26c5.523 0 10 4.477 10 10v51a9 9 0 00-9-9h-27zM276 102h-26c-5.523 0-10 4.477-10 10v51a9 9 0 019-9h27z"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
            />
        </g>
    </svg>
);

export default SvgSourcesFallback;
