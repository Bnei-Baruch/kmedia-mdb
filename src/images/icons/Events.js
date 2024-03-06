import * as React from 'react';

function SvgEvents(props) {
    return (
        <svg
            fill="none"
            height="1em"
            viewBox="0 0 50 50"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
                <g fill="#fff">
                    <path d="M5 13h40v31H5z" />
                    <path d="M5 10h40v31H5z" />
                    <path d="M10 6h3v8h-3zM37 6h3v8h-3z" />
                </g>
                <path d="M34 19h6m-6 0v10m0-10h-6m6 0v15m6-15v10m0-10H16m24 0v5m0 5h-6m6 0v-5m0 5H10m24 0H10m24 0v5M16 19v5m0-5h6m-6 0v15m24-10H16m24 0H10m6 0h-6m6 0v10m-6-10v5m0-5v10m0-5v5m24 0H10m24 0h-6m-18 0h6m0 0h6m0-15v15m0-15h6m-6 15h6m0-15v15" />
            </g>
        </svg>
    );
}

export default SvgEvents;
