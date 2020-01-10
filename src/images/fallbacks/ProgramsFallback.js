import React from "react";

function SvgProgramsFallback(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 480 270"
            width="1em"
            {...props}
        >
            <path d="M0 0h480v270H0z" fill="#e5e5e5" />
            <path d="M-596-82h3228v380H-596z" fill="#fff" />
            <path d="M0 0h480v270H0z" fill="#767676" />
            <g stroke="#5b5b5b" strokeLinecap="square">
                <path d="M198 112h84v42h-84z" fill="#767676" strokeWidth={4} />
                <path d="M198 102h84v46h-84z" fill="#767676" strokeWidth={4} />
                <path d="M264 166h-48M240 166v-12" strokeWidth={4} />
            </g>
        </svg>
    );
}

export default SvgProgramsFallback;
