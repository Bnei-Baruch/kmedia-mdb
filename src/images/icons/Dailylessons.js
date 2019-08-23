import React from "react";

const SvgDailylessons = props => (
    <svg fill="none" height="1em" viewBox="0 0 50 50" width="1em" {...props}>
        <path
            d="M8 6h27v38H8zM40 15h4v25h-4z"
            fill="#fff"
            stroke="#2185d0"
            strokeLinecap="square"
            strokeWidth={2}
        />
        <path d="M42 8l2 5v2h-4v-2z" fill="#fff" />
        <path
            d="M42 6v2m0 0l-2 5v2h4v-2z"
            stroke="#2185d0"
            strokeLinecap="square"
            strokeWidth={2}
        />
        <g stroke="#2185d0" strokeWidth={2}>
            <path
                d="M40 40h4v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
                fill="#fff"
                strokeLinecap="square"
            />
            <path d="M5 11h6M5 15h6M5 19h6M5 23h6M5 27h6M5 31h6M5 35h6M5 39h6" />
        </g>
    </svg>
);

export default SvgDailylessons;
