import { AUDIO_BLOG_LANGUAGES, FN_LANGUAGES } from '../../../../../helpers/consts';
import FilterHeader from '../../../../FiltersAside/FilterHeader';
import LanguageItem from './LanguageItem';

const LanguageFilter = ({ namespace }) => (
  <FilterHeader
    filterName={FN_LANGUAGES}
    children={AUDIO_BLOG_LANGUAGES.map(id => (
      <LanguageItem namespace={namespace} id={id} key={id} />
    ))}
  />
);

export default LanguageFilter;
