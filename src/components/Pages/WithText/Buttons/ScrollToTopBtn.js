import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { textPageGetScrollDirSelector } from '../../../../redux/selectors';

const ScrollToTopBtn = () => {
  const mode = useSelector(textPageGetScrollDirSelector);

  if (mode !== 2) return null;
  const handleScroll = () => window.scrollTo(0, 0);

  return (
    <Button
      icon={<span className="material-symbols-outlined">arrow_upward</span>}
      onClick={handleScroll}
      className="text__scroll-top"
      color="blue"
    />
  );
};

export default ScrollToTopBtn;
