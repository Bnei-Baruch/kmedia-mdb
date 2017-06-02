import React  from 'react';
import PropTypes from 'prop-types';
import { List, Segment } from 'semantic-ui-react';
import map from 'lodash/map'

export default class SourceFilter extends React.Component {
  render() {
    const listItems = !!this.props.sources ? map(this.props.sources, (v, k) => <List.Item key={k}>{v.name}</List.Item>) : [];
    console.log(this.props);
    return (
      <Segment basic attached="bottom" className="tab active">
        <List divided relaxed selection>
          {listItems}
        </List>
      </Segment>
    );
  }
}

const SourceShape = {
  name: PropTypes.string.isRequired,
};
const SourcesType = PropTypes.objectOf(PropTypes.shape(SourceShape));
SourceShape.children = SourcesType;

SourceFilter.propTypes = {
  sources: SourcesType,
  loading: PropTypes.bool,
};
