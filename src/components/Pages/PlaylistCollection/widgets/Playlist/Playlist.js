import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Header, Icon, Menu } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, NO_NAME } from '../../../../../helpers/consts';
import { fromToLocalized } from '../../../../../helpers/date';
import { formatDuration } from '../../../../../helpers/utils';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import Link from '../../../../Language/MultiLanguageLink';

class PlaylistWidget extends Component {
  static propTypes = {
    playlist: PropTypes.shape({}).isRequired,
    selected: PropTypes.number,
    onSelectedChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
  };

  static defaultProps = {
    selected: 0,
    nextLink: null,
    prevLink: null,
  };

  shouldComponentUpdate(nextProps) {
    const { playlist, selected, nextLink, prevLink, language } = this.props;
    return !(
      nextProps.selected === selected
      && nextProps.nextLink === nextLink
      && nextProps.prevLink === prevLink
      && nextProps.language === language
      && isEqual(nextProps.playlist, playlist)
    );
  }

  handleItemClick = (e, data) => {
    const { onSelectedChange } = this.props;
    onSelectedChange(parseInt(data.name, 10));
  };

  renderHeader() {
    const { playlist: { collection }, t, nextLink, prevLink, language } = this.props;

    let content = collection.name;
    if (!content) {
      const ct = collection.content_type === CT_SPECIAL_LESSON ? CT_DAILY_LESSON : collection.content_type;
      content  = `${t(`constants.content-types.${ct}`)}${collection.number ? ` ${t('lessons.list.number')}${collection.number}` : ''}`;
    }

    let subheader = '';
    if (collection.film_date) {
      subheader = t('values.date', { date: collection.film_date });
    } else if (collection.start_date && collection.end_date) {
      subheader = fromToLocalized(collection.start_date, collection.end_date);
    }

    const langDir = getLanguageDirection(language);

    let prevLinkHtml;
    if (prevLink) {
      prevLinkHtml = (
        <Link
          to={prevLink}
          className="avbox__playlist-prev-button"
          title={t('buttons.previous')}
        >
          <Icon name={langDir === 'ltr' ? 'backward' : 'forward'} />
        </Link>
      );
    }

    let nextLinkHtml;
    if (nextLink) {
      nextLinkHtml = (
        <Link
          to={nextLink}
          className="avbox__playlist-next-button"
          title={t('buttons.next')}
        >
          <Icon name={langDir === 'ltr' ? 'forward' : 'backward'} />
        </Link>
      );
    }

    return (
      <Header inverted as="h1">
        {content}
        <Header.Subheader>
          {prevLinkHtml}
          {subheader}
          {nextLinkHtml}
        </Header.Subheader>
      </Header>
    );
  }

  renderContents() {
    const { playlist, selected } = this.props;

    return (
      <div className="avbox__playlist-view">
        <Menu vertical fluid size="small">
          {
            playlist.items.filter(item => item.unit).map((playableItem, index) => (
              <Menu.Item
                key={playableItem.unit.id}
                name={`${index}`}
                content={`${playableItem.unit.name || NO_NAME} - ${formatDuration(playableItem.unit.duration)}`}
                active={index === selected}
                onClick={this.handleItemClick}
              />
            ))
          }
        </Menu>
      </div>
    );
  }

  render() {
    return (
      <div className="avbox__playlist-wrapper">
        {this.renderHeader()}
        {this.renderContents()}
      </div>
    );
  }
}

export default withNamespaces()(PlaylistWidget);
