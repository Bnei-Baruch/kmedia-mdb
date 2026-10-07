import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import Helmets from './Helmets';
import i18next from 'i18next';

const SectionHeader = ({ section, submenuItems }) => {
  const { t } = useTranslation();
  const title    = t(`${section}.header.text`);
  const subText1 = t(`${section}.header.subtext`);
  // eslint-disable-next-line import/no-named-as-default-member
  const subText2 = i18next.exists(`${section}.header.subtext2`) ? t(`${section}.header.subtext2`) : '';
  const hasMenu  = Array.isArray(submenuItems) && submenuItems.length > 0;

  return (
    <div className="section-header">
      <Helmets.Basic title={title} description={subText1} />
      <div className={clsx('p-[14px]', { 'pb-0': hasMenu })}>
        <div className="flex flex-wrap">
          <div className="w-full md:w-3/4 min-[992px]:w-[62.5%]">
            <h1 className="font-lato! text-[42px] leading-[1.28571429em] -mt-1.5 font-normal text-blue-600">
              <div className="section-header__title">
                {title}
              </div>
              {
                subText1 &&
                  <div className="section-header__subtitle mt-[3.2px] mb-2 text-[14px] leading-[1.2em] min-[1200px]:text-[16px] font-normal text-black/60">
                    {subText1}
                  </div>
              }
              {
                subText2 &&
                  <div className="section-header__subtitle2 mb-2 text-[14px] leading-[1.2em] font-normal text-black/60">
                    {subText2}
                  </div>
              }
            </h1>
          </div>
          {
            hasMenu &&
              <div className="w-full pt-[14px]">
                <nav className="section-header__menu flex border-b border-[#d4d4d5] font-lato text-[17px] max-[991px]:text-[14px] max-[640px]:text-[13px]">
                  {submenuItems}
                </nav>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

SectionHeader.propTypes = {
  section: PropTypes.string.isRequired,
  submenuItems: PropTypes.arrayOf(PropTypes.node),
};

export default SectionHeader;
