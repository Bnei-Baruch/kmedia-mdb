import React from 'react';
import { useTranslation } from 'react-i18next';

const ScanBtnTpl = ({ onClick, icon, textKey, text }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick && onClick();
  };

  if (!text && textKey)
    text = t(`page-with-text.buttons.web.${textKey}`);

  return (
    <div
      className="scan_btn"
      onClick={handleClick}
    >
      {text && text}
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );
};

export default ScanBtnTpl;
