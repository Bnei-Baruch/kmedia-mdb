import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { formatError } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';

class LibraryPerson extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    content: shapes.DataWipErr,
    fetchPerson: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    content: {
      data: null,
      wip: false,
      err: null,
    },
  };

  componentDidMount() {
    const { fetchPerson, sourceId, language } = this.props;
    fetchPerson(`persons/${sourceId}-${language}.html`);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchPerson, sourceId, language } = this.props;
    if (nextProps.sourceId !== sourceId
      || nextProps.language !== language) {
      fetchPerson(`persons/${nextProps.sourceId}-${nextProps.language}.html`);
    }
  }

  render() {
    const { person: { wip, err, data }, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.source-content-not-found')} />;
      }
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }
    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }
    let content;
    if (data) {
      try {
        content = data[0].content.rendered;
      } catch (e) {
        content = null;
      }
    }
    if (!content) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    }

    return (
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div className="readble-width" dangerouslySetInnerHTML={{ __html: content }} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(connect(
  (state, ownProps) => ({
    sourceId: ownProps.match.params.id,
    language: settings.getLanguage(state.settings),
    person: selectors.getWP(state.assets),
  }),
  dispatch => bindActionCreators({
    fetchPerson: actions.fetchPerson,
  }, dispatch)
)(withNamespaces()(LibraryPerson)));
