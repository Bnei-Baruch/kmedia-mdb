import * as React from 'react';

function SvgDownload(props) {
    return (
        <svg
            width={16}
            height={16}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path fill="none" d="M0 0h16v16H0z" />
            <path d="M8 16L0 8h4.667V0h6.666v8H16l-8 8z" fill="#fff" />
        </svg>
    );
}

export default SvgDownload;
