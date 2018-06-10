import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Header, Input, Menu, Segment } from 'semantic-ui-react';

import connectFilter from './connectFilter';

class HierarchicalFilter extends React.Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tree: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      count: PropTypes.number,
      children: PropTypes.array,
    })),
    value: PropTypes.arrayOf(PropTypes.string),
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    tree: [],
    value: [],
    onCancel: noop,
    onApply: noop,
    renderItem: x => x.text,
  };

  state = {
    sValue: this.props.value,
    term: '',
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ sValue: nextProps.value });
    }
  }

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.sValue || []);
    this.props.onApply();
  };

  handleClick = (e, data) => {
    const depth = data['data-level'] - 2;

    // clear selection if root was clicked
    if (depth < 0) {
      this.setState({ sValue: [] });
      return;
    }

    const { sValue: oldSelection } = this.state;
    const newSelection             = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(data.name);

    console.log('handleClick', data.name, depth, oldSelection, newSelection);
    this.setState({ sValue: newSelection });

    // const menu = this.menus[depth];
    // const prevScrollTop = menu.scrollTop;
    // this.setState({ selection: newSelection }, () => {
    //   this.menus[depth].scrollTop = prevScrollTop;
    // });
  };

  nodeToItem = (node, level) => {
    const { text, value, count } = node;
    const { sValue }             = this.state;
    const selected               = Array.isArray(sValue) && sValue.length > 0 ? sValue[sValue.length - 1] : null;

    return (
      <Menu.Item
        key={value}
        name={value}
        active={value === selected}
        data-level={level}
        className={`l${level}`}
        onClick={this.handleClick}
      >
        {text}
        {
          Number.isInteger(count) ?
            <span className="count">&nbsp;({count})</span> :
            null
        }
      </Menu.Item>
    );
  };

  getFlatList = () => {
    // modes:
    // 1. no term, no selection: first 2 levels (all + first data level)
    // 2. no term, yes selection: selected path + selected node children
    // 3. yes term, no selection: every match with it's path
    // 4. yes term, yes selection: same as 3
    // In addition, we add "all" root to all of the above modes.

    const { tree } = this.props;

    if (!Array.isArray(tree) || tree.length === 0) {
      return [];
    }

    const root = tree[0];

    const { sValue, term } = this.state;

    const nodes = [root];
    const items = [this.nodeToItem(root, 1)];
    sValue.forEach((x, i) => {
      const node = nodes[nodes.length - 1].children.find(y => y.value === x);
      nodes.push(node);
      items.push(this.nodeToItem(node, 2 + i));
    });

    let lastNode = nodes[nodes.length - 1];
    if (Array.isArray(lastNode.children) && lastNode.children.length > 0) {
      lastNode.children.forEach(x => items.push(this.nodeToItem(x, 2 + sValue.length)));
    } else if (nodes.length > 1) {
      items.splice(items.length - 1, 1);
      lastNode = nodes[nodes.length - 2];
      lastNode.children.forEach(x => items.push(this.nodeToItem(x, 1 + sValue.length)));
    }

    // if (term) {
    //   // mode 3 and 4
    // } else if (sValue) {
    //   // mode 2
    // } else {
    //   // mode 1
    //   items = (root.children || []).map(x => this.nodeToItem(x, 2));
    // }

    // items.unshift(this.nodeToItem(root, 1));

    return items;
  };

  render() {
    const { name, t } = this.props;

    return (
      <Segment.Group>
        <Segment secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              icon="remove"
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t(`filters.${name}.label`)} />
            <Button
              primary
              compact
              size="small"
              content={t('buttons.apply')}
              onClick={this.apply}
            />
          </div>
          <Input fluid className="autocomplete" size="small" icon="search" placeholder={`${t('buttons.search')}...`} />
        </Segment>
        <Segment className="filter-popup__body">
          <Menu vertical fluid size="small" className="hierarchy">
            {this.getFlatList()}
          </Menu>
        </Segment>
      </Segment.Group>
    );
  }
}

export default connectFilter()(HierarchicalFilter);
