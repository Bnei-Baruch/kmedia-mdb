import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import noop from 'lodash/noop';
import { Button, Header, Menu, Segment } from 'semantic-ui-react';

const FlatListFilter = ({ options = [], value = null, onCancel = noop, onApply = noop, renderItem = x => x.text, name }) => {
  const [sValue, setSValue] = useState(value);
  const { t } = useTranslation('common', { useSuspense: false });

  useEffect(() => {
    setSValue(value);
  }, [value]);

  const onSelectionChange = (event, data) => {
    const { value } = options.find(x => x.text === data.name);
    setSValue(value);
  };

  const apply = () => onApply(sValue);

  return (
    <Segment.Group className="filter-popup__wrapper">
      <Segment basic secondary className="filter-popup__header">
        <div className="title">
          <Button
            basic
            compact
            size="tiny"
            content={t('buttons.cancel')}
            onClick={onCancel}
          />
          <Header size="small" textAlign="center" content={t(`filters.${name}.label`)} />
          <Button
            primary
            compact
            size="small"
            content={t('buttons.apply')}
            disabled={!sValue}
            onClick={apply}
          />
        </div>
      </Segment>
      <Segment basic className="filter-popup__body">
        <Menu vertical fluid size="small">
          {
            options.map(x => (
              <Menu.Item
                key={x.value}
                name={x.text}
                active={sValue === x.value}
                onClick={onSelectionChange}
              >
                {renderItem(x)}
              </Menu.Item>
            ))
          }
        </Menu>
      </Segment>
    </Segment.Group>
  );
};

FlatListFilter.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })),
  value: PropTypes.any,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  renderItem: PropTypes.func,
};

export default FlatListFilter;
