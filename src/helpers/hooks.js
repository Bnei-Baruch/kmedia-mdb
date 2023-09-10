import React, { useEffect, useRef } from 'react';

// Used in React hooks to remember previous props.
export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
