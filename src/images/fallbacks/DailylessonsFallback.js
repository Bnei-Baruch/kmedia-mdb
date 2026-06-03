import * as React from "react";
const SvgDailylessonsFallback = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={480} height={270} fill="none" {...props}>
        <path fill="#e5e5e5" d="M0 0h480v270H0z" />
        <path fill="#fff" d="M-76-82h3228v380H-76z" />
        <path fill="#767676" d="M0 0h480v270H0z" />
        <path
            fill="#767676"
            stroke="#5b5b5b"
            strokeLinecap="square"
            strokeWidth={4}
            d="M208 96h54v76h-54zM272 114h8v50h-8z"
        />
        <path fill="#767676" d="m276 100 4 10v4h-8v-4z" />
        <path stroke="#5b5b5b" strokeLinecap="square" strokeWidth={4} d="M276 96v4m0 0-4 10v4h8v-4z" />
        <g stroke="#5b5b5b">
            <path
                fill="#767676"
                strokeLinecap="square"
                strokeWidth={4}
                d="M272 164h8v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"
            />
            <path
                strokeWidth={4}
                d="M202 106h12M202 114h12M202 122h12M202 130h12M202 138h12M202 146h12M202 154h12M202 162h12"
            />
        </g>
    </svg>
);
export default SvgDailylessonsFallback;
