import { useEffect, useRef } from 'react';

import logger from '../logger/logger';

const NAMESPACE = 'useTraceUpdate';

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
      logger.log(NAMESPACE, `Changed props - ${prefix}:`, changedProps);
    }

    prev.current = props;
  });
};

export default useTraceUpdate;
