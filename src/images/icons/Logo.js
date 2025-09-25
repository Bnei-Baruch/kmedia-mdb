import * as React from 'react';
import logoUrl from './logo.svg';

function SvgLogo(props) {
  const { width, height, alt = 'Logo', ...rest } = props;
  return <img src={logoUrl} width={width} height={height} alt={alt} {...rest} />;
}

export default SvgLogo;
