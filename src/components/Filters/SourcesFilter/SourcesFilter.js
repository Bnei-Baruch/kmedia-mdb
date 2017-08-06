import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Menu, Segment } from 'semantic-ui-react';

import { selectors as sources } from '../../../redux/modules/sources';
import connectFilter from '../connectFilter';

class SourcesFilter extends React.Component {

  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    getSourceById: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    allValues: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
  };

  static defaultProps = {
    roots: [],
    onCancel: noop,
    onApply: noop,
    value: [],
    allValues: [],
  };

  state = {
    selection: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selection: nextProps.value
    });
  }

  componentDidUpdate() {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth     = data['data-depth'];

    const { selection: oldSelection } = this.state;
    const newSelection                = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);
    this.setState({ selection: newSelection });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.selection);
    this.props.onApply();
  };

  // Return all lists of selected sources.
  createLists = (depth, items, selection, otherSelected) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    if (selection.length === 0) {
      return [this.createList(depth, items, '', otherSelected.map(s => s[0]))];
    }

    const selected = this.props.getSourceById(selection[0]);
    const current  = this.createList(depth, items, selection[0], otherSelected.map(s => s[0]));
    let next       = [];
    if (selected && selected.children) {
      next = this.createLists(depth + 1, selected.children, selection.slice(1), otherSelected.filter(s => s.length > 0).map(s => s.slice(1)));
    }

    return [current].concat(next);
  };

  createList = (depth, items, selectedId, otherSelectedIds) => {
    const { getSourceById } = this.props;
    return (
      <div key={selectedId} className="filter-steps__column-wrapper">
        <div className="filter-steps__column">
          <Menu fluid vertical color="blue" size="tiny">
            {
              items.map((x) => {
                const node  = getSourceById(x);
                const style = otherSelectedIds.includes(x) && selectedId !== x ?
                  { backgroundColor: 'lightgoldenrodyellow' } :
                  {};

                return (
                  <Menu.Item
                    key={x}
                    value={x}
                    active={selectedId === x}
                    data-depth={depth}
                    onClick={this.onSelectionChange}
                    style={style}
                  >
                    {node.name}
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>
      </div>
    );
  };

  render() {
    const { roots, t } = this.props;

    return (
      <div>
      <Segment vertical  className="tab active" style={{
          padding:'0'
        }}>
        <div
          className="filter-steps"
          // eslint-disable-next-line no-return-assign
          ref={el => this.listContainer = el}
        >
          {
            roots.length > 0 ?
              this.createLists(0, roots, this.state.selection, this.props.allValues).map(l => l) :
              'No Sources'
          }
        </div>
        </Segment>
        <Segment vertical clearing>
          <Button primary content={t('buttons.apply')} floated="right" onClick={this.apply} />
          <Button content={t('buttons.cancel')} floated="right" onClick={this.onCancel} />
        </Segment>
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(connectFilter()(SourcesFilter));
