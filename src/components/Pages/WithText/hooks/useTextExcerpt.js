import { useSelector } from 'react-redux';
import { selectors as assets } from '../../../../redux/modules/assets';
import { textPageGetFileSelector } from '../../../../redux/selectors';

// Opening of the text currently shown on a text page (source, likut, article), headings stripped.
// Used as the meta description when the entity has none; Basic shortens it with seoText().
export const textExcerpt = html => html ? html.slice(0, 5000).replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ') : '';

export const useTextExcerpt = () => {
  const file = useSelector(textPageGetFileSelector);
  const html = useSelector(state => assets.getDoc2htmlById(state.assets)[file?.id]?.data);
  return textExcerpt(html);
};
