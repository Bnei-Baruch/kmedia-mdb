import * as React from 'react';

function SvgLogo(props) {
  const { width = '10em', height = '10em', alt = 'Logo', ...rest } = props;
  return <img src="/assets/KL_TREE_Neg.svg" width={width} height={height} alt={alt} {...rest} />;
}

export default SvgLogo;
