import * as React from "react";
const SvgLecturesFallback = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={480} height={270} fill="none" {...props}>
        <path fill="#e5e5e5" d="M0 0h480v270H0z" />
        <path fill="#fff" d="M-1116-82h3228v380h-3228z" />
        <path fill="#767676" d="M0 0h480v270H0z" />
        <g stroke="#5b5b5b" strokeLinecap="square">
            <path strokeWidth={4} d="M202 96h76M200 96h80M200 148h80M240 149v6" />
            <circle cx={240} cy={158} r={4} fill="#767676" strokeWidth={4} />
            <path strokeWidth={4} d="m212 170 28-56 28 56" />
            <path fill="#767676" strokeWidth={4} d="M204 96h72v52h-72z" />
        </g>
    </svg>
);
export default SvgLecturesFallback;
