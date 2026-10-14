import { useTranslation } from 'react-i18next';
import OmniBox from '../../Search/OmniBox';

const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <h1 className="homepage__title font-lato! text-white hidden lg:block -mt-1 mb-[11.2px] font-bold text-[28px] leading-9 justify-start w-full">
        {t('home.search')}
      </h1>
      <div className="homepage__search w-full">
        <OmniBox isHomePage={true} />
      </div>
    </div>
  );
};


export default SearchBar;
