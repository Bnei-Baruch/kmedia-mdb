import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { formatError } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import * as shapes from '../../shapes';

const LibraryPerson = (props) => {
  const { match: { params: { id: sourceId } }, t } = props;
  const language                    = useSelector(state => settings.getLanguage(state.settings));
  const { wip, err, data: content } = useSelector(state => selectors.getPerson(state.assets));
  const dispatch                    = useDispatch();

  useEffect(
    () => {
      dispatch(actions.fetchPerson({ sourceId, language }));
    },
    [sourceId, language, dispatch]
  );

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
  match: shapes.RouterMatch.isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(withNamespaces()(LibraryPerson));
