import React from 'react';
import moment from 'moment';

import { getVideoRes } from '../../../helpers/consts';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';

const AVUnitWithDep = ({ unit }) => {
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  // if unit.description doesn't exist, use the collection description
  let { description } = unit;
  if (isEmpty(description)) {
    const collections = Object.values(unit.collections);
    if (collections.length > 0) {
      description = collections[0].description;
    }
  }

  const videoDate = moment.utc(unit.film_date).toDate();

  const videoFiles = unit.files
    .filter(file => (file.type === 'video' && contentLanguages.includes(file.language)))
    // Order files by content language.
    .sort((a, b) => contentLanguages.indexOf(a.language) - contentLanguages.indexOf(b.language))
    .map(file => ({
      ...file,
      ...getVideoRes(file.video_size, videoDate),
      url: physicalFile(file, true),
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

const areEqual = (prevProps, nextProps) =>
  ((!prevProps.unit && !nextProps.unit) || prevProps.unit.id === nextProps.unit.id)
  && prevProps.language === nextProps.language;

const AVUnitMemo = React.memo(AVUnitWithDep, areEqual);

const AVUnit = ({ id }) => {
  const unit     = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  if (!unit || !unit.files) {
    return null;
  }

  return <AVUnitMemo unit={unit} />;
};

export default AVUnit;
