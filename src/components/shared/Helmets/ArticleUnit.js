import React, { Component } from 'react';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Article from './Article';

class ArticleUnit extends Component {
  static propTypes = {
    unit: shapes.Article,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit } = this.props;

    if (unit === null) {
      return null;
    }

    return (
      <div>
        {/*TODO (orin): add Helmets.Basic:url ? */}
        {/*TODO (orin): add tags from unit (tags=unit.tags) ? */}
        <Basic title={unit.name} description={unit.description} />
        <Article publishedTime={unit.film_date} />
      </div>
    );
  }
}

export default ArticleUnit;
