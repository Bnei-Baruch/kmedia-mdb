import { connect } from 'react-redux';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import DeepListFilter from './DeepListFilter';

export default connect(
  state => ({
    emptyLabel: 'No Tags',
    roots: selectors.getRoots(state.tags).filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1),
    getSubItemById: selectors.getTagById(state.tags),
  })
)(DeepListFilter);
