import { useEffect, useRef } from 'react';

import logger from '../helpers/logger';

const useTraceUpdate = (props, prefix) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }

      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      logger.log(`Changed props - ${prefix}:`, changedProps);
    }

    prev.current = props;
  });
};

export default useTraceUpdate;
