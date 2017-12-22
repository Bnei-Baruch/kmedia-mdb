import { connect } from 'react-redux';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors as tags } from '../../../redux/modules/tags';
import DeepListFilter from '../common/DeepListFilter';

export default connect(
  state => ({
    emptyLabel: 'No Tags',
    roots: tags.getRoots(state.tags).filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1),
    getSubItemById: tags.getTagById(state.tags),
  })
)(DeepListFilter);
