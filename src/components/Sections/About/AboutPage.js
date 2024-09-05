import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { actions as assetsActions } from '../../../redux/modules/assets';
import WipErr from '../../shared/WipErr/WipErr';
import { settingsGetContentLanguagesSelector, assetsGetAboutSelector } from '../../../redux/selectors';
import { usePrevious } from '../../../helpers/utils';

const AboutPage = () => {
  const { t } = useTranslation();

  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const { wip, err, data } = useSelector(assetsGetAboutSelector);

  const prevLangs = usePrevious(contentLanguages);
  const needFetch = !wip && !err && (!data || prevLangs?.length !== contentLanguages?.length);

  const dispatch = useDispatch();
  useEffect(() => {
    if (needFetch) {
      dispatch(assetsActions.fetchAbout({ contentLanguages }));
    }
  }, [contentLanguages, dispatch, needFetch]);

  const wipErr = WipErr({ wip: wip || !data, err, t });
  if (wipErr) {
    return wipErr;
  }

  return (
    <Container className="padded">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div className="readble-width" dangerouslySetInnerHTML={{ __html: data.content }}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default AboutPage;
