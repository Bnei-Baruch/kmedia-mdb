import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Divider, Header, List } from 'semantic-ui-react';

import { canonicalLink } from '../../../../../helpers/links';
import { isEmpty } from '../../../../../helpers/utils';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions, selectors } from '../../../../../redux/modules/lessons';
import * as shapes from '../../../../shapes';
import NavLink from '../../../../Language/MultiLanguageNavLink';
import WipErr from '../../../../shared/WipErr/WipErr';

class SeriesContainer extends Component {
  static propTypes = {
    bySource: PropTypes.array,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchAll: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    bySource: [],
    wip: false,
    err: null,
  };

  componentDidMount() {
    const { bySource, fetchAll, wip, err } = this.props;

    // We only fetch one time on first mount, if not wip or error.
    // Next time we fetch is on language change.
    if (isEmpty(bySource) && !(wip || err)) {
      fetchAll();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchAll();
    }
  }

  renderTree = (nodes, level) =>
    (nodes || []).map((x) => {
      const { name, items } = x;

      if (isEmpty(items)) {
        return (
          <List.Item key={name} as={NavLink} to={canonicalLink(x)} content={name} />
        );
      }

      return (
        <List.Item key={name}>
          <Header as={`h${level + 2}`} content={name} />
          <List.List>
            {this.renderTree(items, level + 1)}
          </List.List>
        </List.Item>
      );
    });

  render() {
    const { bySource, wip, err, t } = this.props;

    const content = WipErr({ wip, err, t }) || (
      <Container className="padded">
        <List relaxed="very">
          {this.renderTree(bySource, 0)}
        </List>
      </Container>
    );

    return (
      <div>
        <Divider fitted />
        {content}
      </div>
    );
  }
}

const mapState = state => ({
  bySource: selectors.getSeriesBySource(state.lessons, state.mdb, state.sources),
  language: settings.getLanguage(state.settings),
  wip: selectors.getWip(state.lessons).series,
  err: selectors.getErrors(state.lessons).series,
});

const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAll: actions.fetchAllSeries,
  }, dispatch)
);

export default connect(mapState, mapDispatch)(withNamespaces()(SeriesContainer));
