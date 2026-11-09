import { Helmet } from './helmetESM';
import { compact } from '../../../helpers/seo';

// Escape "<" so content (e.g. "</script>") can't break out of the script tag.
const serialize = data => JSON.stringify(compact(data)).replace(/</g, '\\u003c');

/**
 * schema.org structured data as <script type="application/ld+json">.
 * `id` keeps several JsonLd blocks on one page distinct.
 */
const JsonLd = ({ data, id }) => {
  if (!data) return null;

  return (
    <Helmet>
      <script type="application/ld+json" data-ld={id}>{serialize({ '@context': 'https://schema.org', ...data })}</script>
    </Helmet>
  );
};

export default JsonLd;
