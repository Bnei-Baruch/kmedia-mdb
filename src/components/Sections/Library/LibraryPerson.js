import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import { actions as assetsActions } from '../../../redux/modules/assets';
import WipErr from '../../shared/WipErr/WipErr';
import { cmsUrl, Requests } from '../../../helpers/Api';
import { publicFile } from '../../../helpers/utils';
import { settingsGetContentLanguagesSelector, assetsGetPersonSelector } from '../../../redux/selectors';

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
        url      : imageFile,
        width    : 160,
        height   : 200,
        nocrop   : false,
        stripmeta: true
      });

      content = content.replace(img, src);
    }
  }

  return content;
};

const LibraryPerson = ({ t }) => {
  const { id: sourceId }            = useParams();
  const contentLanguages            = useSelector(settingsGetContentLanguagesSelector);
  const { wip, err, data: content } = useSelector(assetsGetPersonSelector);
  const dispatch                    = useDispatch();

  useEffect(
    () => {
      dispatch(assetsActions.fetchPerson({ sourceId, contentLanguages }));
    },
    [sourceId, contentLanguages, dispatch]
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
            <div className="readble-width" dangerouslySetInnerHTML={{ __html: convertImages(content) }}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

LibraryPerson.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(LibraryPerson);
