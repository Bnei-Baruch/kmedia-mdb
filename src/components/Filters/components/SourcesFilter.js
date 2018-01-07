import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/sources';
import DeepListFilter from './DeepListFilter';

export default connect(
  state => ({
    emptyLabel: 'No Sources',
    roots: selectors.getRoots(state.sources),
    getSubItemById: selectors.getSourceById(state.sources),
  })
)(DeepListFilter);
