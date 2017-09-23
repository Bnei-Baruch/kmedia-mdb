import { connect } from 'react-redux';
import { selectors as eventsSelectors } from '../../../redux/modules/events';
import DeepListFilter from '../common/DeepListFilter';

export default connect(
  (state) => {
    const tree = eventsSelectors.getEventFilterTree(state.events);

    return ({
      emptyLabel: 'No Events',
      roots: tree.roots,
      getSubItemById: id => tree.byIds[id]
    });
  }
)(DeepListFilter);
