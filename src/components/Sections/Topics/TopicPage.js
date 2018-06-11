import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, /*Card,*/ Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SectionHeader from '../../shared/SectionHeader';
import {actions, selectors} from '../../../redux/modules/tags';
import TopN from './TopN';

export const topNItems = 5;

class TopicPage extends Component {

    static propTypes = {
      sections: PropTypes.arrayOf(PropTypes.string),
      getSectionUnits: PropTypes.func,
      fetchDashboard: PropTypes.func.isRequired
    }

    componentDidMount(){
      this.loadTopic(this.props);
    }

    componentWillReceiveProps(nextProps){
      if (this.props.match.params.id !== nextProps.match.params.id){
        this.loadTopic(nextProps);
      }
    }

    loadTopic(nextProps){
      const { fetchDashboard } = nextProps;
      const topicId = nextProps.match.params.id;

      console.log('load topic', topicId);
      fetchDashboard(topicId);

    }
        
    render(){
      const {sections, getSectionUnits} = this.props;

      return(
        <Container>
          <SectionHeader section="topics" />
          <Grid container doubling columns={2} className="homepage__iconsrow">
            {
              Array.isArray(sections) && sections.length > 0 && getSectionUnits ?
                sections.map(s => {
                  const sectionUnits = getSectionUnits(s);
                  return (
                    <Grid.Column key={s}>
                      <TopN section={s} units={sectionUnits} N={topNItems} />
                    </Grid.Column>
                  )  
                }) :
                null
            }
          </Grid>
        </Container>
      );
    }
}

export default withRouter(connect(
  (state) => ({
    sections: selectors.getSections(state.tags),
    getSectionUnits: selectors.getSectionUnits(state.tags)
  }),
  dispatch => bindActionCreators({
    fetchDashboard: actions.fetchDashboard
  }, dispatch)
)(TopicPage));