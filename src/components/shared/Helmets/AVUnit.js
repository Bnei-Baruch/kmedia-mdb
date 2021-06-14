import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getVideoRes } from '../../../helpers/consts';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';

const AVUnit = ({ unit = undefined, language = undefined }) => {
  if (!unit || !unit.files) {
    return null;
  }

  if (!language) {
    return null;
  }

  // if unit.description doesn't exist, use the collection description
  let { description } = unit;
  if (isEmpty(description)) {
    const collections = Object.values(unit.collections);
    if (collections.length > 0) {
      ({ description } = collections[0]);
    }
  }

  const videoDate = moment.utc(unit.film_date).toDate();

  const videoFiles = unit.files
    .filter(file => (file.type === 'video' && file.language === language))
    .map(file => ({
      ...file,
      ...getVideoRes(file.video_size, videoDate),
      url: physicalFile(file, true)
    }));

  return (
    <div>
      <Basic title={unit.name} description={description} />
      <Image unitOrUrl={unit} />
      {videoFiles.map(file => <Video key={file.id} releaseDate={unit.film_date} {...file} />)}

      {/* // /!*TODO: add Helmets.Basic:url ? *!/ */}
      {/* // /!*TODO: add tags from unit (tags=unit.tags) ? *!/ */}
      {/* // /!*TODO: add profile helmet *!/ */}
      {/* // /!*TODO: add* Helmets.Article:section *!/ */}
      {/* // <Article publishedTime={unit.film_date} /> */}

    </div>
  );
};

AVUnit.propTypes = {
  unit: shapes.ContentUnit,
  language: PropTypes.string
};

const areEqual = (prevProps, nextProps) =>
  ((!prevProps.unit && !nextProps.unit) || prevProps.unit.id === nextProps.unit.id)
  && prevProps.language === nextProps.language;

export default React.memo(AVUnit, areEqual);
