import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/tags';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Link from '../../Language/MultiLanguageLink';
import TopN from './TopN';

const topNItems = 5;

class TopicPage extends Component {
  static propTypes = {
    sections: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSectionUnits: PropTypes.func.isRequired,
    getPathByID: PropTypes.func.isRequired,
    match: shapes.RouterMatch.isRequired,
    fetchDashboard: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    wip: shapes.WIP,
    error: shapes.Error,
  };

  static defaultProps = {
    wip: false,
    error: null
  };

  componentDidMount() {
    this.loadTopic(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id
      || this.props.match.params.language !== nextProps.match.params.language) {
      this.loadTopic(nextProps);
    }
  }

  loadTopic = (props) => {
    const { fetchDashboard, match } = props;
    const tagId                     = match.params.id;

    fetchDashboard(tagId);
  };

  render() {
    const { sections, getSectionUnits, getPathByID, match, t, wip, error } = this.props;
    const { id: tagId, language }                                          = match.params;

    const wipErr = WipErr({ wip, error, t });
    if (wipErr) {
      return wipErr;
    }

    if (getPathByID && !isEmpty(sections)) {
      const tagPath = getPathByID(tagId);

      // create breadCrumb sections from tagPath
      const breadCrumbSections = [
        { id: '', label: t('nav.sidebar.topics') },
        ...tagPath,
      ].map((p, index, arr) => {
        const section = {
          key: p.id,
          content: p.label,
        };

        if (index === arr.length - 1) {
          section.active = true;
        } else {
          section.as = Link;
          section.to = `/topics/${p.id}`;
        }

        return section;
      });
      const breadCrumbIcon     = `${RTL_LANGUAGES.includes(language) ? 'left' : 'right'} angle`;

      return (
        <Container className="padded">
          <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
          <Divider hidden />
          <Grid doubling columns={sections.length}>
            {
              sections.map((s) => {
                const sectionUnits = getSectionUnits(s);

                return isEmpty(sectionUnits)
                  ? null
                  : (
                    <Grid.Column key={s}>
                      <TopN
                        section={s}
                        units={sectionUnits}
                        N={topNItems}
                        tagPath={tagPath}
                        language={language}
                      />
                    </Grid.Column>
                  );
              })
            }
          </Grid>
        </Container>
      );
    }

    return (
      <div>
        Topic
        {tagId}
        {' '}
        Not Found
      </div>
    );
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
)(withNamespaces()(TopicPage)));
