import * as React from "react";

function SvgPrograms(props) {
    return (
        <svg
            fill="none"
            height={50}
            width={50}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
                <path d="M4 13h42v21H4z" fill="#fff" />
                <path d="M4 8h42v23H4z" fill="#fff" />
                <path d="M37 40H13M25 40v-6" />
            </g>
        </svg>
    );
}

export default SvgPrograms;
