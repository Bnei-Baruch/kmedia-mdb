import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { RTL_LANGUAGES } from '../../helpers/consts';

class SearchResultsHeader extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  render() {
    const { t, language, sortBy, onSortByChange } = this.props;
    const isRTL = RTL_LANGUAGES.includes(language);

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    return (
      <div style={{float: isRTL ? 'left' : 'right'}}>
        <span style={{padding: '10px'}}>
          {t('search.sortby')}:
        </span>
        <Dropdown
          compact
          selection
          options={options}
          value={sortBy}
          onChange={onSortByChange}
        />
      </div>
    );
  }
}

export default translate()(SearchResultsHeader);
