import { connect } from 'react-redux';
import { selectors as sources } from '../../../redux/modules/sources';
import DeepListFilter from '../common/DeepListFilter';

export default connect(
  state => ({
    emptyLabel: 'No Sources',
    roots: sources.getRoots(state.sources),
    getSubItemById: sources.getSourceById(state.sources),
  })
)(DeepListFilter);
