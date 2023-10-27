import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withTranslation, useTranslation } from 'next-i18next';

import { actions, selectors } from '../../lib/redux/slices/assetSlice/assetSlice';
import { selectors as settings } from '../../lib/redux/slices/settingsSlice/settingsSlice';
import WipErr from '../../src/components/shared/WipErr/WipErr';
import { cmsUrl, Requests } from '../../src/helpers/Api';
import { publicFile } from '../../src/helpers/utils';
import { wrapper } from '../../lib/redux';
import { LANG_HEBREW, DEFAULT_CONTENT_LANGUAGE } from '../../src/helpers/consts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchSQData } from '../../lib/redux/slices/mdbSlice';
import { filtersTransformer } from '../../lib/filters';
import { fetchPerson } from '../../lib/redux/slices/assetSlice';

// Convert WP images to full URL+imaginary
const convertImages = content => {
  const regex = /<img[^>]*src="([^"]*)"/g;
  let arr;
  while ((arr = regex.exec(content))) {
    const img = arr[1];
    if (!img.startsWith('http') && !img.startsWith('/static/')) {
      let imageFile = cmsUrl(img);
      if (!/^http/.exec(imageFile)) {
        imageFile = publicFile(imageFile);
      }

      const src = Requests.imaginary('resize', {
        url: imageFile,
        width: 160,
        height: 200,
        nocrop: false,
        stripmeta: true,
      });

      content = content.replace(img, src);
    }
  }

  return content;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const uiLang           = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const { id: sourceId } = context.query;

  const state = store.getState();
  await store.dispatch(fetchSQData());
  const contentLanguages = settings.getContentLanguages(state.settings);
  const { content } = await store.dispatch(fetchPerson({ sourceId, contentLanguages })).unwrap();

  const _i18n = await serverSideTranslations(uiLang);
  return { props: { ..._i18n, content } };
});

const PersonsPage = ({ content }) => {
  const { t } = useTranslation();

  if (!content) {
    return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
  }

  return (
    <Container className="padded">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div className="readble-width" dangerouslySetInnerHTML={{ __html: convertImages(content) }} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default PersonsPage;
