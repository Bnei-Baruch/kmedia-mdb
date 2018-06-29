import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Container, Divider } from 'semantic-ui-react';

import SectionHeader from '../../shared/SectionHeader';
import { actions, selectors } from '../../../redux/modules/tags';
import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import SectionHeader from '../../shared/SectionHeader';
import TopN from './TopN';

export const topNItems = 5;

class TopicPage extends Component {
    static propTypes = {
      sections: PropTypes.arrayOf(PropTypes.string).isRequired,
      getSectionUnits: PropTypes.func.isRequired,
      getPathByID: PropTypes.func.isRequired,
      match: shapes.RouterMatch.isRequired,
      fetchDashboard: PropTypes.func.isRequired,
      // fetchTags: PropTypes.func.isRequired,
    }

    componentDidMount() {
      this.loadTopic(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.id !== nextProps.match.params.id) {
        this.loadTopic(nextProps);
      }
    }

    loadTopic = (nextProps) => {
      const { fetchDashboard, fetchTags } = nextProps;
      const tagId = nextProps.match.params.id;

      // fetchTags();
      fetchDashboard(tagId);
    }

    render() {
      const { sections, getSectionUnits, getPathByID, match } = this.props;
      const tagId = match.params.id;

      if (getPathByID && !isEmpty(sections)) {
        const tagPath = getPathByID(tagId);

        return (
          <Container>
            <Grid container doubling columns={sections.length} className="homepage__iconsrow">
              {
                sections.map((s) => {
                  const sectionUnits = getSectionUnits(s);
                  return isEmpty(sectionUnits) ?
                    null :
                    <Grid.Column key={s}>
                      <TopN
                        section={s}
                        units={sectionUnits}
                        N={topNItems}
                        tagId={tagId}
                        tagPath={tagPath}
                      />
                    </Grid.Column>;
                })
              }
            </Grid>
          </Container>
        );
      }

      return <div>Topic {tagId} Not Found</div>;
    }
}

export default withRouter(connect(
  state => ({
    sections: selectors.getSections(state.tags),
    getSectionUnits: selectors.getSectionUnits(state.tags),
    getPathByID: selectors.getPathByID(state.tags)
  }),
  dispatch => bindActionCreators({
    fetchDashboard: actions.fetchDashboard,
    // fetchTags: actions.fetchTags
  }, dispatch)
)(TopicPage));
