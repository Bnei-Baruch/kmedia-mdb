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
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';

class LibraryPerson extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    fetchPerson: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static getPerson({ fetchPerson, sourceId, language }) {
    fetchPerson(`persons-${sourceId}-${language}-html`);
  }

  componentDidMount() {
    LibraryPerson.getPerson(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { sourceId, language } = this.props;
    if (nextProps.sourceId !== sourceId
      || nextProps.language !== language) {
      LibraryPerson.getPerson(nextProps);
    }
  }

  render() {
    const { person: { wip, err, data: content }, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.source-content-not-found')} />;
      }
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }
    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }
    if (!content) {
      return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
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
    person: selectors.getPerson(state.assets),
  }),
  dispatch => bindActionCreators({
    fetchPerson: actions.fetchPerson,
  }, dispatch)
)(withNamespaces()(LibraryPerson)));
