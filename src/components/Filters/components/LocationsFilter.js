import { connect } from 'react-redux';
import { selectors } from '../../../redux/modules/events';
import DeepListFilter from './DeepListFilter';

export default connect(
  (state) => {
    const tree = selectors.getLocationsTree(state.events);

    return ({
      emptyLabel: 'No Events',
      roots: tree.roots,
      getSubItemById: id => tree.byIds[id]
    });
  }
)(DeepListFilter);
