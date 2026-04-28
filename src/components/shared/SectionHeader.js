import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Helmets from './Helmets';
import i18next from 'i18next';

const SectionHeader = ({ section, t, submenuItems }) => {
  const title    = t(`${section}.header.text`);
  const subText1 = t(`${section}.header.subtext`);
  // eslint-disable-next-line import/no-named-as-default-member
  const subText2 = i18next.exists(`${section}.header.subtext2`) ? t(`${section}.header.subtext2`) : '';

  return (
    <div className="section-header">
      <Helmets.Basic title={title} description={subText1} />
      <div className=" px-4 ">
        <div className="flex flex-wrap">
          <div className="w-full md:w-3/4 lg:w-[62.5%]">
            <h1 className="text-blue-600">
              <span className="section-header__title">
                {title}
              </span>
              {
                subText1 &&
                  <div className="section-header__subtitle text-base font-normal text-gray-500">
                    {subText1}
                  </div>
              }
              {
                subText2 &&
                  <div className="section-header__subtitle2 text-base font-normal text-gray-500">
                    {subText2}
                  </div>
              }
            </h1>
          </div>
          {
            Array.isArray(submenuItems) && submenuItems.length > 0 &&
              <div className="w-full">
                <nav className="section-header__menu flex border-b large">
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
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SectionHeader);
