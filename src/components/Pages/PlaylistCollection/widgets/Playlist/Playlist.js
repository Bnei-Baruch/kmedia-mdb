import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { Header, Menu, Icon } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, DATE_FORMAT, NO_NAME } from '../../../../../helpers/consts';
import { formatDuration, canonicalLink } from '../../../../../helpers/utils';
import { fromToLocalized } from '../../../../../helpers/date';

class PlaylistWidget extends Component {

  static propTypes = {
    playlist: PropTypes.object.isRequired,
    selected: PropTypes.number,
    onSelectedChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    fetchCollections: PropTypes.func.isRequired,
    collectionsByDate: PropTypes.any,
  };

  static defaultProps = {
    selected: 0
  };

  handleItemClick = (e, data) => {
    this.props.onSelectedChange(parseInt(data.name, 10));
  };

  handlePrevLessonClick = (e, data) => {
    if (this.props.playlist.collection.film_date && this.props.fetchCollections)
    {
      let toDate = new Date(this.props.playlist.collection.film_date);
      let fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 5);
      this.props.fetchCollections({start_date:this.formatDate(fromDate), end_date:this.formatDate(toDate), isNext:false});
    }   
  };

  handleNextLessonClick = (e, data) => {
    if (this.props.playlist.collection.film_date && this.props.fetchCollections)
    {
      let fromDate = new Date(this.props.playlist.collection.film_date);
      let toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + 5);
      this.props.fetchCollections({start_date:this.formatDate(fromDate), end_date:this.formatDate(toDate), isNext:true});
    }  
  };


  formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }



  componentWillReceiveProps(nextProps) {

    if (this.props.collectionsByDate !== nextProps.collectionsByDate) {
      if (nextProps.collectionsByDate && nextProps.collectionsByDate.length > 0) {
        let result = nextProps.collectionsByDate["0"];
        let collections = result.collections;      
        let curIndex = collections.findIndex(x => {
          return x.id == this.props.playlist.collection.id;
        });
        let nextUrl = this.getNextUrl(collections, curIndex, result.payload.isNext);
        if (nextUrl != null)
        {
          window.location = nextUrl;
        }
        else
        {
          alert('לא נמצא שיעור קודם/הבא');
        }
      }
    }

    this.setState({
      selection: nextProps.value
    });
  }

  getNextUrl(collections, curIndex, isNext)
  {
    if (isNext)
    {
        // Goto next lesson        
        if (curIndex > 1)
        {
          let collection = collections[curIndex - 1];
          return canonicalLink(collection);
        }         
    }
    else
    {
        // Goto prev lesson
        if (collections.length > curIndex + 1)
        {
          let collection = collections[curIndex + 1];
          return canonicalLink(collection);
        }
    }                    
    return null;    
  }

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
      subheader = t('values.date', { date: new Date(collection.film_date) });
    } else if (collection.start_date && collection.end_date) {
      subheader = fromToLocalized(
        moment.utc(collection.start_date, DATE_FORMAT),
        moment.utc(collection.end_date, DATE_FORMAT));
    }

    return <Header inverted as="h1" content={content} subheader={subheader} />;
  }

  renderContents() {
    const { playlist, selected } = this.props;

  

    return (
      <div className="avbox__playlist-view">
        <div dir="ltr">

          <button type="button" tabIndex="-1" title="שיעור הקודם" onClick={this.handlePrevLessonClick} style={{marginRight: '0.5em'}}>            
            <Icon name="backward" />
          </button>
          <button type="button" tabIndex="-1" title="שיעור הבא" onClick={this.handleNextLessonClick} style={{marginLeft: '0.5em'}}>
            <Icon name="forward" />            
          </button>
        </div>
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
      <div className='avbox__playlist-wrapper'>
        {this.renderHeader()}
        {this.renderContents()}
      </div>
    );
  }
}

export default PlaylistWidget;
