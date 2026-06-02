import React from 'react';
import { useTranslation } from 'react-i18next';
import OmniBox from '../../Search/OmniBox';

const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-3/4">
        <h1 className="homepage__title text-white hidden md:block mb-2">{t('home.search')}</h1>
      </div>
      <div className="w-full md:w-11/12 lg:w-3/4">
        <div className="homepage__search">
          <OmniBox isHomePage={true} />
        </div>
      </div>
    </div>
  );
};


export default SearchBar;
