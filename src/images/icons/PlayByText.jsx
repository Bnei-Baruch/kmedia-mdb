import * as React from "react";
const SvgPlayByText = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
        <g clipPath="url(#play-by-text_svg__a)">
            <path d="M16.163 4.862h6.125v1.452h-2v10.423h-1.882V6.314h-2.243z" />
            <path d="M16.163 19.27h6.125v-1.451h-2V7.395h-1.882v10.424h-2.243zM3.288 17.768V5.893L13.38 11.83z" />
        </g>
        <defs>
            <clipPath id="play-by-text_svg__a">
                <path d="M.949.133h24v24h-24z" />
            </clipPath>
        </defs>
    </svg>
);
export default SvgPlayByText;
