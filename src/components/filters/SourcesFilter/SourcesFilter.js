import React  from 'react';
import PropTypes from 'prop-types';
import { List, Segment } from 'semantic-ui-react';
import map from 'lodash/map'

export default class SourceFilter extends React.Component {
  state = {
    selection: [],
  };

  onSelectionChange = (event, props) => {
    const {value} = props;
    const depth = props['data-depth']
    this.setState((prevState, props) => {
      const { selection } = prevState;
      selection.splice(depth, selection.length - depth);
      selection.push(value);
      return { ...prevState, selection };
    });
  };

  // Return all lists of selected sources.
  createLists = (depth, sources, selection) => {
    if (!sources || Object.keys(sources).length == 0) {
      return [];
    }
    if (selection.length > 0) {
      const selected = selection[0];
      return [this.createList(depth, sources, selected)].concat(
        this.createLists(depth + 1, sources[selected].children, selection.slice(1)));
    } else {
      return [this.createList(depth, sources, '')];
    }
  }

  createList = (depth, sources, selected) => {
    return (
      <List key={selected} divided relaxed selection style={{width: "33%"}}>{
        map(sources, (v, k) =>
          <List.Item active={selected === k}
                     onClick={this.onSelectionChange}
                     key={k} data-depth={depth} value={k}>{v.name}</List.Item>)}
      </List>
    );
  }

  render() {
    return (
      <Segment basic attached="bottom" className="tab active" style={{display: "flex", flex: 1, flexDirection: "row"}}>
        {!!this.props.sources ?
          this.createLists(0, this.props.sources, this.state.selection).map(l => l) :
          "Loading..."}
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
