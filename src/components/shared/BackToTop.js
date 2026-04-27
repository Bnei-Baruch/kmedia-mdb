/* This component __HAVE__ to be __BEFORE__ content */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const BackToTop = ({ isRTL, offset = [0, 0] }) => {
  const [backToTop, setBackToTop] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setBackToTop(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleBackToTop = () => {
    window.scrollTo(0, 0);
  };

  const style = isRTL
    ? { position: 'fixed', left: 50, bottom: 70 }
    : { position: 'fixed', right: 50, bottom: 70 };

  return (
    <>
      <div ref={sentinelRef} />
      {backToTop && (
        <button
          className="border border-gray-300 bg-white rounded px-2 py-1 small hover:bg-gray-50"
          onClick={handleBackToTop}
          style={style}
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      )}
    </>
  );
};

BackToTop.isBrowser = () => (typeof window !== 'undefined' && window.document);

BackToTop.propTypes = {
  isRTL: PropTypes.bool.isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
  ]),
};

export default BackToTop;
