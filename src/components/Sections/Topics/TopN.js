import { produce } from 'immer';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

import { SectionLogo } from '../../../helpers/images';
import * as renderUnitHelper from '../../../helpers/renderUnitHelper';
import { isNotEmptyArray, strCmp } from '../../../helpers/utils';
import * as shapes from '../../shapes';

const TopN = ({ units, N, sectionCount, section, topicUrl, t }) => {
  const [topNUnits, setTopNUnits]         = useState([]);
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    const topNUnits = getTopNUnits(units, N);
    setTopNUnits(topNUnits);

    const buttonViewAllVisible = isButtonViewAllVisible(sectionCount, N, topicUrl);
    setButtonVisible(buttonViewAllVisible);
  }, [units, sectionCount, N, topicUrl]);

  return (isNotEmptyArray(topNUnits)
    ? renderTable(topNUnits, section, buttonVisible ? topicUrl : null, t)
    : null);
};

const isButtonViewAllVisible = (totalUnits, N, url) => (
  totalUnits > N && !url.includes('events')
);

const getTopNUnits = (units, N) => {
  const validUnits = units.filter(u => !!u);

  const topNUnits = produce(validUnits, draft => {
    if (isNotEmptyArray(draft)) {
      draft.sort(compareUnits);
    }
  });

  return topNUnits.length > N
    ? topNUnits.slice(0, N)
    : topNUnits;
};

const compareUnits = (u1, u2) => strCmp(u2.film_date, u1.film_date);

const renderTable = (topNUnits, section, url, t) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className="text-left">
          <h3 className="flex items-center gap-2">
            <span className="inline-block align-middle">
              <SectionLogo name={section} />
            </span>
            {t(`nav.sidebar.${section}`)}
          </h3>
        </th>
      </tr>
    </thead>
    <tbody>
      {topNUnits.map(x => renderUnit(x, t))}
    </tbody>
    {
      url
        ? (
          <tfoot>
            <tr>
              <th className="text-left">
                <a
                  className="inline-block bg-blue-500 text-white small px-3 py-1.5 rounded hover:bg-blue-600"
                  href={url}
                >
                  {t('buttons.view-all')}
                </a>
              </th>
            </tr>
          </tfoot>
        )
        : null
    }
  </table>
);

const renderUnit = (unit, t) =>
  (
    <tr key={unit.id} className="align-top">
      <td>
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
        { renderUnitHelper.renderUnitNameLink(unit)}
      </td>
    </tr>
  );

TopN.propTypes = {
  section: PropTypes.string.isRequired,
  units: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
  N: PropTypes.number.isRequired,
  sectionCount: PropTypes.number.isRequired,
  topicUrl: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(TopN);
