import React from 'react';
import { useSelector } from 'react-redux';

import { textPageGetScrollDirSelector } from '../../../../redux/selectors';

const ScrollToTopBtn = () => {
  const mode = useSelector(textPageGetScrollDirSelector);

  if (mode !== 2) return null;
  const handleScroll = () => window.scrollTo(0, 0);

  return (
    <button
      onClick={handleScroll}
      className="text__scroll-top bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  );
};

export default ScrollToTopBtn;
