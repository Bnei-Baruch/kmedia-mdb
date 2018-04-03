import React, { Component } from 'react';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Article from './Article';
import Locale from './Locale';

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

    console.log('ARTICLE UNIT:', unit);
    return (
      <div>
        {/*TODO (orin): add Helmets.Basic:url ? */}
        <Basic title={unit.name} description={unit.description} />
        {/*TODO (orin): add tags from unit (tags=unit.tags) ? */}
        {/*TODO (orin): add profile helmet */}
        {/*TODO (orin): add* Helmets.Article:section */}
        <Article publishedTime={unit.film_date} />
        {/* TODO (orin): add alternate lang */}
        {/* <Helmets.Locale mainLang={unit.original_language} /> */}


      </div>
    );
  }
}

export default ArticleUnit;
