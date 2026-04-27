import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../../helpers/utils';

import { SectionLogo } from '../../../helpers/images';

/*
 * It was used once in SearchResults, but not anymore...
 */
const SectionsFilter = (value = null, onCancel = noop, onApply = noop, t) => {
  const [sValue, setSValue] = useState(value);

  useEffect(() => setSValue(value), [value]);

  const onSelectionChange = section => setSValue(`filters.sections-filter.${section}`);

  const apply = () => onApply(sValue);

  const gridColumn = (x, sValue, t) => (
    <div key={x} className="text-center">
      <div
        className={`small font-semibold cursor-pointer ${(sValue && sValue.endsWith(x)) ? 'active' : ''}`}
        onClick={() => onSelectionChange(x)}
      >
        <SectionLogo name={x}/>
        <br/>
        {t(`nav.sidebar.${x}`)}
      </div>
    </div>
  );

  return (
    <div className="filter-popup__wrapper border rounded">
      <div className="filter-popup__header bg-gray-100 p-3">
        <div className="title">
          <button
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
            onClick={onCancel}
          >
            {t('buttons.cancel')}
          </button>
          <h4 className="small font-semibold text-center flex-1">{t('filters.sections-filter.label')}</h4>
          <button
            className="px-2 py-1 small bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!sValue}
            onClick={apply}
          >
            {t('buttons.apply')}
          </button>
        </div>
      </div>
      <div className="filter-popup__body sections-filter p-3">
        <div className="grid grid-cols-5 gap-4 p-4">
          {
            ['lessons', 'programs', 'sources', 'events', 'publications'].map(x => gridColumn(x, sValue, t))
          }
        </div>
      </div>
    </div>
  );
};

SectionsFilter.propTypes = {
  value   : PropTypes.string,
  onCancel: PropTypes.func,
  onApply : PropTypes.func,
  t       : PropTypes.func.isRequired,
};

export default SectionsFilter;
