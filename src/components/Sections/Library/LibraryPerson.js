import React, { useEffect } from 'react';
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

const getPerson = ({ fetchPerson, sourceId, language }) => {
  fetchPerson(`persons-${sourceId}-${language}-html`);
};

const LibraryPerson = (props) => {
  useEffect(
    () => {
      getPerson({ sourceId: props.sourceId, language: props.language, fetchPerson: props.fetchPerson });
    },
    [props.sourceId, props.language, props.fetchPerson]
  );

  const { person: { wip, err, data: content }, t } = props;

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
};

LibraryPerson.propTypes = {
  sourceId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  fetchPerson: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

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
