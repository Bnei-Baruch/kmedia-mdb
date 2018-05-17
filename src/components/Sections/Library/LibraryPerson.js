import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { selectors as settings } from '../../../redux/modules/settings';

import { actions as staticActions, selectors as staticSelectors } from '../../../redux/modules/staticFiles';
import * as shapes from '../../shapes';
import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';

class LibraryPerson extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }),
    fetchContent: PropTypes.func.isRequired,
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
    const { fetchContent, sourceId, language } = this.props;
    fetchContent(`/persons/${sourceId}-${language}.html`);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchContent, sourceId, language } = this.props;
    if (nextProps.sourceId !== sourceId) {
      fetchContent(`/persons/${nextProps.sourceId}-${language}.html`);
    }
  }

  render() {
    const { content, t }                                          = this.props;
    const { wip: contentWip, err: contentErr, data: contentData } = content;

    let result = (
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              { /* eslint-disable-next-line react/no-danger */ }
              <div className="readble-width" dangerouslySetInnerHTML={{ __html: contentData }} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
    if (contentErr) {
      if (contentErr.response && contentErr.response.status === 404) {
        result = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        result = <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
      }
    } else if (contentWip) {
      result = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (!contentData) {
      result = <Segment basic>{t('sources-library.no-source')}</Segment>;
    }

    return result;
  }
}

export default withRouter(connect(
  (state, ownProps) => ({
    sourceId: ownProps.match.params.id,
    content: staticSelectors.getContent(state.staticFiles),
    language: settings.getLanguage(state.settings),
  }),
  dispatch => bindActionCreators({
    fetchContent: staticActions.fetchStatic,
  }, dispatch)
)(translate()(LibraryPerson)));
