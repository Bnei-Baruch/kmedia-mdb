import Headroom from 'react-headroom';
import logger from '../../logger/logger';

const HeadroomWraper = ({ children }) => {

  if (typeof window === 'undefined') {
    logger.log('HeadroomWraper render', 'SSR');
    return <div>{children}</div>;
  }

  logger.log('HeadroomWraper render', Headroom);
  return (
    <Headroom>
      {children}
    </Headroom>
  );
};

export default HeadroomWraper;
