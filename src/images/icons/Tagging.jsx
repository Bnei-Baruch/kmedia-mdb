import * as React from "react";
const SvgTagging = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" {...props}>
        <path
            strokeLinecap="square"
            strokeWidth={2}
            d="M1.949 4.805A3.17 3.17 0 0 1 5.12 1.633h11.656a3.17 3.17 0 0 1 3.172 3.172V16.46a3.17 3.17 0 0 1-3.172 3.172H5.12a3.17 3.17 0 0 1-3.172-3.172z"
        />
        <path d="M13.322 8.557H9.168l-.593 4.154h4.154z" />
        <path
            strokeLinecap="square"
            strokeWidth={2}
            d="M6.795 8.557h9M8.179 15.48l1.385-9.692M6.102 12.71h9m-2.769 2.769 1.385-9.692"
        />
    </svg>
);
export default SvgTagging;
