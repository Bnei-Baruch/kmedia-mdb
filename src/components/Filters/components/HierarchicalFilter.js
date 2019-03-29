import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import scrollIntoView from 'scroll-into-view';
import { Button, Header, Input, Menu, Segment } from 'semantic-ui-react';

import { getEscapedRegExp, isEmpty } from '../../../helpers/utils';

class HierarchicalFilter extends Component {
  static propTypes = {
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
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tree: [],
    value: [],
    onCancel: noop,
    onApply: noop,
  };

  state = {
    sValue: this.props.value,
    term: '',
  };

  handleTermChange = debounce((e, data) => {
    this.setState({ term: data.value });
  }, 200);

  componentDidMount() {
    if (this.activeRef) {
      scrollIntoView(ReactDOM.findDOMNode(this.activeRef), {
        time: 150, // half a second
        validTarget: (target, parentsScrolled) => (parentsScrolled < 1),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ sValue: nextProps.value });
    }
  }

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.onApply(this.state.sValue || []);
  };

  tracepath = (node, value) => {
    if (node.value === value) {
      return [node.value];
    }

    if (!isEmpty(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const path = this.tracepath(node.children[i], value);
        if (!isEmpty(path)) {
          return [node.value].concat(path);
        }
      }
    }

    return [];
  };

  handleActiveRef = (ref) => {
    this.activeRef = ref;
  };

  handleClick = (e, data) => {
    const depth       = data['data-level'] - 2;
    const isCallApply = data['is-last-leaf'] === 'true';

    // clear selection if root was clicked
    if (depth < 0) {
      this.setState({ sValue: [] });
      return;
    }

    // in term mode we trace path
    if (this.state.term) {
      const path = this.tracepath(this.props.tree[0], data.name);
      this.setState({ sValue: path.slice(1) });
      return;
    }

    // in normal selection mode we insert
    // the new value at it's relevant, depth based, index
    const { sValue }   = this.state;
    const oldSelection = sValue || [];
    const newSelection = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(data.name);

    if (isCallApply) {
      this.props.onApply(newSelection);
    } else {
      this.setState({ sValue: newSelection });
    }
  };

  nodeToItem = (node, level, reg) => {
    const { text, value, count } = node;
    const { sValue }             = this.state;
    const selected               = Array.isArray(sValue) && sValue.length > 0 ? sValue[sValue.length - 1] : null;
    const active                 = value === selected;
    const ref                    = active ? this.handleActiveRef : null;

    let content = text;
    if (reg && reg.test(text)) {
      content = (
        <span dangerouslySetInnerHTML={{
          __html: content.replace(reg, '<span class="highlight">$&</span>')
        }}
        />
      );
    }

    return (
      <Menu.Item
        key={value}
        name={value}
        ref={ref}
        active={active}
        data-level={level}
        is-last-leaf={(!node.children || node.children.length === 0).toString()}
        className={`l${level}`}
        onClick={this.handleClick}
      >
        {content}
        {
          Number.isInteger(count)
            ? (
              <span className="filter__count">
                &nbsp;(
                {count}
                )
              </span>
            )
            : null
        }
      </Menu.Item>
    );
  };

  nodeToItemRec = (node, level, reg) => {
    let items = [this.nodeToItem(node, level, reg)];

    if (!isEmpty(node.children)) {
      items = node.children.reduce((acc, val) => acc.concat(this.nodeToItemRec(val, level + 1, reg)), items);
    }

    return items;
  };

  filterNode = (node, reg, selected) => {
    let children = (node.children || [])
      .map(x => this.filterNode(x, reg, selected))
      .filter(x => !!x);

    // if this node is selected we keep all it's original children
    if (selected === node.value && isEmpty(children)) {
      children = [...(node.children || [])];
    }

    if (selected === node.value || !isEmpty(children) || reg.test(node.text)) {
      return { ...node, children };
    }

    return null;
  };

  getFlatList = () => {
    const { tree } = this.props;
    if (!Array.isArray(tree) || tree.length === 0) {
      return [];
    }

    const { sValue, term } = this.state;
    const selection        = sValue || [];

    // start with root node
    const root  = tree[0];
    const nodes = [root];
    const items = [this.nodeToItem(root, 1)];

    // if we have a search term we use it and stop
    if (term) {
      const reg          = getEscapedRegExp(term);
      const selected     = Array.isArray(sValue) && sValue.length > 0 ? sValue[sValue.length - 1] : null;
      const filteredRoot = this.filterNode(root, reg, selected);

      return filteredRoot ? this.nodeToItemRec(filteredRoot, 1, reg) : items;
    }

    // no search term, we just show by selection

    // add in selection path
    selection.forEach((x, i) => {
      const node = nodes[nodes.length - 1].children.find(y => y.value === x);
      nodes.push(node);
      items.push(this.nodeToItem(node, 2 + i));
    });

    // Add children of last node in selection (if any)
    // or replace it with its siblings (including himself)
    let lastNode = nodes[nodes.length - 1];
    if (Array.isArray(lastNode.children) && lastNode.children.length > 0) {
      lastNode.children.forEach(x => items.push(this.nodeToItem(x, 2 + selection.length)));
    } else if (nodes.length > 1) {
      items.splice(items.length - 1, 1);
      lastNode = nodes[nodes.length - 2];
      lastNode.children.forEach(x => items.push(this.nodeToItem(x, 1 + selection.length)));
    }

    return items;
  };

  render() {
    const { name, t } = this.props;

    return (
      <Segment.Group className="filter-popup__wrapper">
        <Segment basic secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.cancel')}
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t(`filters.${name}.label`)} />
            <Button
              primary
              compact
              size="tiny"
              content={t('buttons.apply')}
              onClick={this.apply}
            />
          </div>
          <Input
            fluid
            className="autocomplete"
            size="small"
            icon="search"
            placeholder={`${t('buttons.search')}...`}
            onChange={this.handleTermChange}
          />
        </Segment>
        <Segment basic className="filter-popup__body">
          <Menu vertical fluid size="small" className="hierarchy">
            {this.getFlatList()}
          </Menu>
        </Segment>
      </Segment.Group>
    );
  }
}

export default HierarchicalFilter;
