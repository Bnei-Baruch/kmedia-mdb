import React, { Component } from 'react';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';
import Locale from './Locale';

class AVUnit extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit } = this.props;

    if (unit === null) {
      return null;
    }

    // TODO (orin): if unit.description doesn't exist, use the collection description

    return (
      <div>
        <Basic title={unit.name} description={unit.description} />
        <Image unitOrUrl={unit} />

        {/*// /!*TODO: add Helmets.Basic:url ? *!/*/}
        {/*// <Basic title={unit.name} description={unit.description} />*/}
        {/*// /!*TODO: add tags from unit (tags=unit.tags) ? *!/*/}
        {/*// /!*TODO: add profile helmet *!/*/}
        {/*// /!*TODO: add* Helmets.Article:section *!/*/}
        {/*// <Article publishedTime={unit.film_date} />*/}
        {/*// /!* TODO: add alternate lang *!/*/}
        {/*// <Locale mainLang={unit.original_language} />*/}
        {/* Todo: add video type, video tags*/}
        {/* TODO: add type*/}
        {/* TODO: add language */}
        {/* TODO: add image*/}
        {/*<Video releaseDate={unit.film_date} duration={unit.duration} />*/}

        {/* TODO: original language is not part of ProgramChapter content unit*/}
        {/*<Locale mainLang={unit.original_language} />*/}
      </div>
    );
  }
}

export default AVUnit;
