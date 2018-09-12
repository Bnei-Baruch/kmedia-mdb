import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Container, Breadcrumb, Header } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/tags';
import { isEmpty } from '../../../helpers/utils';
import { RTL_LANGUAGES } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import TopN from './TopN';
import WipErr from '../../shared/WipErr/WipErr';

export const topNItems = 5;

class TopicPage extends Component {
    static propTypes = {
      sections: PropTypes.arrayOf(PropTypes.string).isRequired,
      getSectionUnits: PropTypes.func.isRequired,
      getPathByID: PropTypes.func,
      match: shapes.RouterMatch.isRequired,
      fetchDashboard: PropTypes.func.isRequired,
      t: PropTypes.func.isRequired,
      wip: shapes.WIP,
      error: shapes.Error,
    }

    static defaultProps = {
      wip: false,
      error: null
    };

    componentDidMount() {
      this.loadTopic(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.id !== nextProps.match.params.id ||
          this.props.match.params.language !== nextProps.match.params.language) {
        this.loadTopic(nextProps);
      }
    }

    loadTopic = (props) => {
      const { fetchDashboard, match } = props;
      const tagId = match.params.id;

      fetchDashboard(tagId);
    }

    render() {
      const { sections, getSectionUnits, getPathByID, match, t, wip, error } = this.props;
      const { id: tagId, language } = match.params;

      const wipErr = WipErr({ wip, error, t });
      if (wipErr) {
        return wipErr;
      }

      if (getPathByID && !isEmpty(sections)) {
        const tagPath = getPathByID(tagId);

        // create breadCrumb sections from tagPath
        const breadCrumbSections = tagPath.map((p, index, arr) =>
          ({ key: p.id,
            content: p.label,
            // last item is active and not a link
            active: index === arr.length - 1,
            href: index === arr.length - 1 ? null : `/topics/${p.id}`
          }));
        const breadCrumbIcon = `${RTL_LANGUAGES.includes(language) ? 'left' : 'right'} angle`;
        const topicHeader = tagPath[tagPath.length - 1].label;

        return (
          <Container className="padded">
            <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="small" className="section-header" />
            <Header as="h1" color="blue" className="section-header__title">{topicHeader}</Header>
            <Grid doubling columns={sections.length}>
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
                        tagPath={tagPath}
                        t={t}
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
    wip: selectors.getWip(state.tags),
    error: selectors.getError(state.tags),
    sections: selectors.getSections(state.tags),
    getSectionUnits: selectors.getSectionUnits(state.tags),
    getPathByID: selectors.getPathByID(state.tags)
  }),
  dispatch => bindActionCreators({
    fetchDashboard: actions.fetchDashboard
  }, dispatch)
)(translate()(TopicPage)));
