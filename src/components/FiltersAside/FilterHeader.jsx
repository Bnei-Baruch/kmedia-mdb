import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FilterHeader = ({ filterName, children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!open);
  return (
    <div className="filter_aside">
      <div className="title flex items-center justify-between">
        <span>{t(`filters.aside-filter.${filterName}`)}</span>
        <span className="material-symbols-outlined text-[#2185d0] cursor-pointer text-[28px]! leading-[20px]! h-5" onClick={toggleOpen}>
          {`arrow_drop_${open ? 'up' : 'down'}`}
        </span>
      </div>
      {open && children}
    </div>
  );
};

export default FilterHeader;
