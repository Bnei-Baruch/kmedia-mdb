import * as shapes from '../../shapes';
import Basic from './Basic';
import Article from './Article';
import { useTextExcerpt } from '../../Pages/WithText/hooks/useTextExcerpt';

const ArticleUnit = ({ unit = undefined }) => {
  const excerpt = useTextExcerpt();
  if (!unit) {
    return null;
  }

  return (
    <div>
      <Basic title={unit.name} description={unit.description || excerpt} />
      <Article publishedTime={unit.film_date} />
    </div>
  );
};

ArticleUnit.propTypes = {
  unit: shapes.Article,
};

export default ArticleUnit;
