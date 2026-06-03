import Headroom from 'react-headroom';
import { useSyncExternalStore } from 'react';

const HeadroomWraper = ({ children }) => {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!isClient) {
    return <div>{children}</div>;
  }

  return (
    <Headroom>
      {children}
    </Headroom>
  );
};

export default HeadroomWraper;
