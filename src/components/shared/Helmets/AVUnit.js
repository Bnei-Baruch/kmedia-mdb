import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getVideoRes } from '../../../helpers/consts';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';

class AVUnit extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    language: PropTypes.string
  };

  static defaultProps = {
    unit: undefined,
    language: undefined,
  };

  render() {
    const { unit, language } = this.props;

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
        description = collections[0].description;
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
  }
}

export default AVUnit;
