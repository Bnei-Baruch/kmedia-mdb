import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { withTranslation } from 'next-i18next';

import { actions, selectors } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import WipErr from '../../shared/WipErr/WipErr';
import { cmsUrl, Requests } from '../../../helpers/Api';
import { publicFile } from '../../../helpers/utils';

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

const LibraryPerson = ({ t }) => {
  const { id: sourceId }            = useParams();
  const contentLanguages            = useSelector(state => settings.getContentLanguages(state.settings));
  const { wip, err, data: content } = useSelector(state => selectors.getPerson(state.assets));
  const dispatch                    = useDispatch();

  useEffect(
    () => {
      dispatch(actions.fetchPerson({ sourceId, contentLanguages }));
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
            <div className="readble-width" dangerouslySetInnerHTML={{ __html: convertImages(content) }} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

LibraryPerson.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LibraryPerson);
