import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Accordion, Button, Header, Menu, Segment, Flag } from 'semantic-ui-react';
import { ALL_LANGUAGES, LANGUAGES, AUDIO_BLOG_LANGUAGES } from '../../../helpers/consts';

const LanguageFilter = ({ t, value, namespace, onCancel, onApply }) => {
  const onLanguageChange = (event, data) => onApply(data.name);

  const displayedLanguages = namespace === 'publications-audio-blog'
    ? AUDIO_BLOG_LANGUAGES
    : ALL_LANGUAGES;

  return (
    <Segment.Group>
      <Segment secondary className="filter-popup__header">
        <div className="title">
          <Button
            basic
            compact
            icon="remove"
            onClick={onCancel}
          />
          <Header size="small" textAlign="center" content={t('filters.language-filter.label')} />
        </div>
      </Segment>
      <Segment className="filter-popup__body language-filter">
        <Accordion as={Menu} vertical fluid size="small">
          {
            displayedLanguages.map(x => (
              (
                <Menu.Item
                  key={x}
                  name={x}
                  active={value === x}
                  onClick={onLanguageChange}
                >
                  <Flag name={LANGUAGES[x].flag} />
                  {t(`constants.languages.${x}`)}
                </Menu.Item>
              )
            ))
          }
        </Accordion>
      </Segment>
    </Segment.Group>
  );
}

LanguageFilter.propTypes = {
  namespace: PropTypes.string,
  value: PropTypes.string,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  t: PropTypes.func.isRequired,
};

LanguageFilter.defaultProps = {
  value: null,
  onCancel: noop,
  onApply: noop,
};

export default withNamespaces()(LanguageFilter);
