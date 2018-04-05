import React, { Component } from 'react';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';
import { isEmpty } from '../../../helpers/utils';

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

    // if unit.description doesn't exist, use the collection description
    const description = isEmpty(unit.description) ? Object.values(unit.collections)[0].description : unit.description;

    return (
      <div>
        <Basic title={unit.name} description={description} />
        <Image unitOrUrl={unit} />

        {/*// /!*TODO: add Helmets.Basic:url ? *!/*/}
        {/*// /!*TODO: add tags from unit (tags=unit.tags) ? *!/*/}
        {/*// /!*TODO: add profile helmet *!/*/}
        {/*// /!*TODO: add* Helmets.Article:section *!/*/}
        {/*// <Article publishedTime={unit.film_date} />*/}

      </div>
    );
  }
}

export default AVUnit;
