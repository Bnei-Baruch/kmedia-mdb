import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import UnitLogo from '../../shared/Logo/UnitLogo';
import SectionHeader from '../../shared/SectionHeader';
import UnitListContainer from '../../Pages/UnitList/Container';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/links';
import { sectionThumbnailFallback } from '../../../helpers/images';
import { NO_NAME, CT_DAILY_LESSON } from '../../../helpers/consts';
import Link from '../../Language/MultiLanguageLink';

class TopicPage extends Component {

    static propTypes = {
      topicId: PropTypes.number.isRequired
    }

    state = {
      topicId: null
    }

    componentDidMount(){
      this.loadTopic(this.props.topicId);
    }

    loadTopic(topicId){
      if (topicId !== this.state.topicId){
        this.setState(topicId);
      }
    }

    getSectionType = (unit) => {
      const s = canonicalLink(unit).split('/');
      const section = s.length > 0 ? s[1] : null;
  
      return section;
    }

    getItemOfCaption = (unit, t) => {
      const sectionType = this.getSectionType(unit);
  
      let itemOfCaption;
      switch (sectionType){
        case 'lessons':
          itemOfCaption = t('lessons.list.related');
          break;
        case 'programs':
          itemOfCaption = t('programs.list.episode_from');
          break;
        case 'lectures':
          itemOfCaption = t('lectures.list.item_from');
          break;
        case 'events':
          itemOfCaption = t('events.list.item_from');
          break;
        case 'publications':
          itemOfCaption = t('publications.list.item_from');
          break;
        default:
          break;
      }
    
      return itemOfCaption;
    }

    getUnitTitle = (unit, t) => (
      this.getSectionType(unit) === 'lessons' ?
      t(`constants.content-types.${CT_DAILY_LESSON}`) :
      null
    )

    renderUnit = (unit, t) => {
      const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
      const topicUnits  = breakdown.getAllTopicUnits();
    
      const relatedItems = topicUnits.map(x =>
        (
          <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
            {x.name || this.getUnitTitle(x, t)}
          </List.Item>
        )
      );
        
      let filmDate = '';
      if (unit.film_date) {
        filmDate = t('values.date', { date: new Date(unit.film_date) });
      }
      
      const link = canonicalLink(unit);
      const itemOfCaption = this.getItemOfCaption(unit, t);
    
      return (
        <Table.Row key={unit.id} verticalAlign="top">
          <Table.Cell collapsing singleLine>
            <Link to={link}>
              <UnitLogo
                className="index__thumbnail"
                unitId={unit.id}
                collectionId={topicUnits.length > 0 ? topicUnits[0].id : null}
                fallbackImg={sectionThumbnailFallback.programs}
              />
            </Link>
          </Table.Cell>
          <Table.Cell>
            <span className="index__date">{filmDate}</span>
            <Link className="index__title" to={link}>
              {unit.name || NO_NAME}
            </Link>
            {relatedItems.length === 0 ?
            null :
            <List horizontal divided link className="index__collections" size="tiny">
              <List.Item>
                <List.Header>{itemOfCaption}</List.Header>
              </List.Item>
              {relatedItems}
            </List>
            }
          </Table.Cell>
        </Table.Row>
      );
    };
    
    render(){
      return(
        <div>
          <SectionHeader section="topics" />
          <UnitListContainer
              namespace="topics"
              renderUnit={this.renderUnit}  
          />
        </div>
      );
     
    }
}

export default withRouter(TopicPage);