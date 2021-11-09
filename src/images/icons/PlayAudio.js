import * as React from "react";

function SvgPlayAudio(props) {
    return (
        <svg
            width={20}
            height={21}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M8.8 14.238l4.67-3.355a.464.464 0 000-.766L8.8 6.763c-.33-.24-.8-.01-.8.383v6.708c0 .393.47.623.8.384zM10 .917C4.48.917 0 5.21 0 10.5s4.48 9.583 10 9.583S20 15.79 20 10.5 15.52.917 10 .917zm0 17.25c-4.41 0-8-3.44-8-7.667 0-4.226 3.59-7.667 8-7.667s8 3.44 8 7.667c0 4.226-3.59 7.667-8 7.667z"
                fill="#000"
                fillOpacity={0.54}
            />
        </svg>
    );
}

export default SvgPlayAudio;
