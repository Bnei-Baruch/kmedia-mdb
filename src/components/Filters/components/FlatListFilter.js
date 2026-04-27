import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from '../../../helpers/utils';

const FlatListFilter = (
  {
    options = [],
    value = null,
    onCancel = noop,
    onApply = noop,
    renderItem = x => x.text,
    name
  }
) => {
  const { t }               = useTranslation();
  const [sValue, setSValue] = useState(value);

  useEffect(() => {
    setSValue(value);
  }, [value]);

  const onSelectionChange = text => {
    const { value } = options.find(x => x.text === text);
    setSValue(value);
  };

  const apply = () => onApply(sValue);

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
          <h4 className="small font-semibold text-center flex-1">{t(`filters.${name}.label`)}</h4>
          <button
            className="px-2 py-1 small bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!sValue}
            onClick={apply}
          >
            {t('buttons.apply')}
          </button>
        </div>
      </div>
      <div className="filter-popup__body p-3">
        <nav className="flex flex-col w-full small">
          {
            options.map(x => (
              <div
                key={x.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${sValue === x.value ? 'bg-blue-50 font-semibold' : ''}`}
                onClick={() => onSelectionChange(x.text)}
              >
                {renderItem(x)}
              </div>
            ))
          }
        </nav>
      </div>
    </div>
  );
};

FlatListFilter.propTypes = {
  name      : PropTypes.string.isRequired,
  options   : PropTypes.arrayOf(PropTypes.shape({
    text : PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })),
  value     : PropTypes.any,
  onCancel  : PropTypes.func,
  onApply   : PropTypes.func,
  t         : PropTypes.func.isRequired,
  renderItem: PropTypes.func,
};

export default FlatListFilter;
