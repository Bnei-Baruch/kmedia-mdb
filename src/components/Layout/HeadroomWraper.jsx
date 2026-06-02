import Headroom from 'react-headroom';
import logger from '../../logger/logger';

const HeadroomWraper = ({ children }) => {

  if (typeof window === 'undefined') {
    return <div>{children}</div>;
  }

  return (
    <Headroom>
      {children}
    </Headroom>
  );
};

export default HeadroomWraper;
