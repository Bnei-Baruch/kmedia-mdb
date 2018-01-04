import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/publications';
import DeepListFilter from '../common/DeepListFilter';

export default connect(
  (state) => {
    const publisherById = selectors.getPublisherById(state.publications);
    return {
      emptyLabel: 'No Publishers',
      roots: Object.keys(publisherById),
      getSubItemById: id => publisherById[id],
    };
  }
)(DeepListFilter);
