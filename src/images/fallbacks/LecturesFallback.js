import React from "react";

function SvgLecturesFallback(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 480 270"
            width="1em"
            {...props}
        >
            <path d="M0 0h480v270H0z" fill="#e5e5e5" />
            <path d="M-1116-82h3228v380h-3228z" fill="#fff" />
            <path d="M0 0h480v270H0z" fill="#767676" />
            <g stroke="#5b5b5b" strokeLinecap="square">
                <path
                    d="M202 96h76M200 96h80M200 148h80M240 149v6"
                    strokeWidth={4}
                />
                <circle
                    cx={240}
                    cy={158}
                    fill="#767676"
                    r={4}
                    strokeWidth={4}
                />
                <path d="M212 170l28-56 28 56" strokeWidth={4} />
                <path d="M204 96h72v52h-72z" fill="#767676" strokeWidth={4} />
            </g>
        </svg>
    );
}

export default SvgLecturesFallback;
