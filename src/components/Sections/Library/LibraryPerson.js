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
    fetchAsset: PropTypes.func.isRequired,
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
    const { fetchAsset, sourceId, language } = this.props;
    fetchAsset(`persons/${sourceId}-${language}.html`);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchAsset, sourceId, language } = this.props;
    if (nextProps.sourceId !== sourceId
      || nextProps.language !== language) {
      fetchAsset(`persons/${nextProps.sourceId}-${nextProps.language}.html`);
    }
  }

  render() {
    const { content: { wip, err, data }, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.source-content-not-found')} />;
      }
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }
    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }
    if (!data) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    }

    return (
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div className="readble-width" dangerouslySetInnerHTML={{ __html: data }} />
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
    content: selectors.getAsset(state.assets),
    language: settings.getLanguage(state.settings),
  }),
  dispatch => bindActionCreators({
    fetchAsset: actions.fetchAsset,
  }, dispatch)
)(withNamespaces()(LibraryPerson)));
