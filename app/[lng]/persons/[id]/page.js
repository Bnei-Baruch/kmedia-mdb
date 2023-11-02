import React from 'react';
import { Container, Grid, Segment, GridRow, GridColumn } from '/lib/SUI';
import { fetchPerson } from '../../../api/assets';
import { Requests, cmsUrl } from '../../../../src/helpers/Api';
import { publicFile } from '../../../../src/helpers/utils';
import { useTranslation } from '../../../i18n';

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
const PersonsPage   = async ({ params: { lng, id } }) => {
  const contentLanguages = ['ru', 'en', 'he'];
  const { content }      = await fetchPerson({ id, contentLanguages });
  const { t }            = await useTranslation(lng);

  if (!content) {
    return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
  }

  return (
    <Container className="padded">
      <Grid>
        <GridRow>
          <GridColumn>
            <div className="readble-width" dangerouslySetInnerHTML={{ __html: convertImages(content) }} />
            *
          </GridColumn>
        </GridRow>
      </Grid>
    </Container>
  );
};

export default PersonsPage;
