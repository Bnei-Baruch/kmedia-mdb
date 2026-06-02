import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FilterHeader = ({ filterName, children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!open);
  return (
    <div className="filter_aside">
      <div className="title flex items-center justify-between">
        <span className="text-lg font-bold">{t(`filters.aside-filter.${filterName}`)}</span>
        <span className="material-symbols-outlined text-blue-500 cursor-pointer text-3xl" onClick={toggleOpen}>
          {`arrow_drop_${open ? 'down' : 'up'}`}
        </span>
      </div>
      {open && children}
    </div>
  );
};

export default FilterHeader;
