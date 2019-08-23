import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';

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

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
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
