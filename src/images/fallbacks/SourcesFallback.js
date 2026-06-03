import * as React from "react";
const SvgSourcesFallback = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={480} height={270} fill="none" {...props}>
        <path fill="#e5e5e5" d="M0 0h480v270H0z" />
        <path fill="#fff" d="M-2156-82h3228v380h-3228z" />
        <g fill="#767676">
            <path d="M0 0h480v270H0z" />
            <path stroke="#5b5b5b" strokeLinecap="square" strokeWidth={4} d="M256 96h10v15h-10z" />
            <path
                fillRule="evenodd"
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
                d="M282 108h-84v62h37.333l.667 2h8l.667-2H282z"
                clipRule="evenodd"
            />
            <path stroke="#5b5b5b" strokeLinecap="square" strokeWidth={4} d="M204 114h72v50h-72z" />
            <path
                stroke="#5b5b5b"
                strokeLinecap="square"
                strokeWidth={4}
                d="M204 102h26c5.523 0 10 4.477 10 10v51a9 9 0 0 0-9-9h-27zM276 102h-26c-5.523 0-10 4.477-10 10v51a9 9 0 0 1 9-9h27z"
            />
        </g>
    </svg>
);
export default SvgSourcesFallback;
