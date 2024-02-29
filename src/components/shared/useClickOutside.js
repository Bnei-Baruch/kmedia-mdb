import { useEffect } from 'react';

export const useClickOutside = (onOutsideClick, refs = []) => {
  useEffect(() => {
    const handleClick = e => {
      if (refs.find(r => r.current?.contains(e.target))) {
        return;
      }

      onOutsideClick();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [refs, onOutsideClick]);

  return null;
};
