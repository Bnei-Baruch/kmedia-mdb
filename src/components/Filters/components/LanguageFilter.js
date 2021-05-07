import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { noop } from '../../../helpers/utils';
import { Accordion, Button, Header, Menu, Segment } from 'semantic-ui-react';
import { ALL_LANGUAGES, AUDIO_BLOG_LANGUAGES, LANGUAGES, POPULAR_LANGUAGES } from '../../../helpers/consts';

const LanguageFilter = ({ t, value = null, namespace, onCancel = noop, onApply = noop, contentLanguage }) => {
  const onLanguageChange = (event, data) => onApply(data.name);

  const displayedLanguages = namespace === 'publications-audio-blog'
    ? AUDIO_BLOG_LANGUAGES
    : ALL_LANGUAGES.filter(l => !POPULAR_LANGUAGES.includes(l));

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
                  {LANGUAGES[x].name}
                </Menu.Item>
              )
            ))
          }
        </Accordion>
      </Segment>
    </Segment.Group>
  );
};

LanguageFilter.propTypes = {
  namespace: PropTypes.string,
  value: PropTypes.string,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(LanguageFilter);
