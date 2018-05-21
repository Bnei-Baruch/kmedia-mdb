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

    if (!unit) {
      return null;
    }

    return (
      <div>
        <Basic title={unit.name} description={unit.description} />
        <Article publishedTime={unit.film_date} />
      </div>
    );
  }
}

export default ArticleUnit;
