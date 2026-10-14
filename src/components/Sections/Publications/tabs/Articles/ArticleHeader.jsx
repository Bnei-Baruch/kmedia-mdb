import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import * as shapes from '../../../../shapes';

const SECTION = 'publications';

const ArticleHeader = ({ unit }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line import/no-named-as-default-member
  const subText2 = i18next.exists(`${SECTION}.header.subtext2`) ? t(`${SECTION}.header.subtext2`) : '';

  return (
    <div className="section-header">
      <div className="px-4 py-2">
        <div className="flex flex-wrap">
          <div className="w-full md:w-3/4 lg:w-[62.5%]">
            <h1 className="text-4xl lg:text-5xl font-normal text-blue-600">
              <div className="section-header__title lg:pb-4">
                {unit.name}
              </div>
              {
                unit.description &&
                  <div className="section-header__subtitle text-base font-normal text-gray-500">
                    {unit.description}
                  </div>
              }
              {
                subText2 &&
                  <div className="section-header__subtitle2 text-base font-normal text-gray-500">
                    {subText2}
                  </div>
              }
            </h1>
            <h4 className="text-gray-500 display-inline">
              {t('values.date', { date: unit.film_date })}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

ArticleHeader.propTypes = {
  unit: shapes.ContentUnit,
};

export default ArticleHeader;
