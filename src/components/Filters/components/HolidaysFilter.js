import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/events';
import { selectors as tags } from '../../../redux/modules/tags';
import DeepListFilter from './DeepListFilter';

export default connect(
  (state) => {
    const tree = selectors.getHolidaysTree(state.events);

    return ({
      emptyLabel: 'No Events',
      roots: tree.roots,
      getSubItemById: id => {
        const x = tree.byIds[id];
        const t = tags.getTagById(state.tags)(id);
        return { ...x, name: t ? t.label : x.name };
      }
    });
  }
)(DeepListFilter);
