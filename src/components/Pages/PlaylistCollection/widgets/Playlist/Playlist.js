import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Icon, Item } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, NO_NAME } from '../../../../../helpers/consts';
import { fromToLocalized } from '../../../../../helpers/date';
import { formatDuration } from '../../../../../helpers/utils';

import Link from '../../../../Language/MultiLanguageLink';

class PlaylistWidget extends Component {
  static propTypes = {
    playlist: PropTypes.object.isRequired,
    selected: PropTypes.number,
    onSelectedChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
    langDir: PropTypes.string,
  };

  static defaultProps = {
    selected: 0
  };

  handleItemClick = (e, data) => {
    this.props.onSelectedChange(parseInt(data.name, 10));
  };

  renderHeader() {
    const { playlist, selected, t } = this.props;
    const { collection }            = playlist;

    let content = collection.name;
    if (!content) {
      const ct = collection.content_type === CT_SPECIAL_LESSON ? CT_DAILY_LESSON : collection.content_type;
      content  = `${t(`constants.content-types.${ct}`)} - ${(selected + 1)}/${collection.content_units.length}`;
    }

    let subheader = '';
    if (collection.film_date) {
      subheader = t('values.date', { date: collection.film_date });
    } else if (collection.start_date && collection.end_date) {
      subheader = fromToLocalized(collection.start_date, collection.end_date);
    }

    return <Header inverted as="h1" content={content} subheader={subheader} />;
  }

  renderNextPrevLinks() {
    const { nextLink, prevLink, t, langDir } = this.props;  

    let prevLinkHtml = '';
    if (prevLink) {
      prevLinkHtml = (
        <Item as={Link} 
          to={prevLink} 
          className="button" 
          title={t('player.prev-lesson')}
          >
          <Icon name={langDir === 'ltr' ? 'backward' : 'forward'} />
        </Item>
      );      
    }
    let nextLinkHtml = '';
    if (nextLink) {
      nextLinkHtml = (
        <Item as={Link} 
          to={nextLink} 
          className="button" 
          title={t('player.next-lesson')}
        >
            <Icon name={langDir === 'ltr' ? 'forward' : 'backward'} />
        </Item>
      );      
    }

    return (      
      <div className="avbox__playlist-next-prev-buttons">         
        {prevLinkHtml}          
        {nextLinkHtml}  
      </div>
    );
  }

  renderContents() {
    const { playlist, selected } = this.props;

    return (
      <div className="avbox__playlist-view">
        {this.renderNextPrevLinks()}      
        <Menu vertical fluid size="small">
          {
            playlist.items.map((playableItem, index) => (
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

export default PlaylistWidget;
