import * as React from "react";
const SvgProgramsFallback = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={480} height={270} fill="none" {...props}>
        <path fill="#e5e5e5" d="M0 0h480v270H0z" />
        <path fill="#fff" d="M-596-82h3228v380H-596z" />
        <path fill="#767676" d="M0 0h480v270H0z" />
        <g stroke="#5b5b5b" strokeLinecap="square">
            <path fill="#767676" strokeWidth={4} d="M198 112h84v42h-84z" />
            <path fill="#767676" strokeWidth={4} d="M198 102h84v46h-84z" />
            <path strokeWidth={4} d="M264 166h-48M240 166v-12" />
        </g>
    </svg>
);
export default SvgProgramsFallback;
