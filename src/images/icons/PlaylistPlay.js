import * as React from "react";

function SvgPlaylistPlay(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            viewBox="0 0 23 24"
            width="100%"
            fill="#000"
            {...props}
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3 10h11v2H3zM3 6h11v2H3zM3 14h7v2H3zM16 13v8l6-4z" />
        </svg>
    );
}

export default SvgPlaylistPlay;
