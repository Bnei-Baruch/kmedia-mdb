import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import Helmets from '../../../shared/Helmets';
import { publicFile } from '../../../../helpers/utils';
import Page from '../Playlist/Page';
import BuildPlaylistLastDaily from './BuildPlaylistLastDaily';

const LastLessonCollection = ({ t }) => {
  return (
    <div>
      <Helmets.Basic title={t('lessons.last.title')} description={t('lessons.last.description')} />
      <Helmets.Image unitOrUrl={publicFile('seo/last_lesson.jpg')} />
      <BuildPlaylistLastDaily />
      <Page />
    </div>
  );
};

LastLessonCollection.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces()(LastLessonCollection);
