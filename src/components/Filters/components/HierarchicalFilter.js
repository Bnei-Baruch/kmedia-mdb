import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { noop, getEscapedRegExp, isEmpty } from '../../../helpers/utils';
import scrollIntoView from 'scroll-into-view';

class HierarchicalFilter extends Component {
  static propTypes = {
    name    : PropTypes.string.isRequired,
    tree    : PropTypes.arrayOf(PropTypes.shape({
      text    : PropTypes.string.isRequired,
      value   : PropTypes.string.isRequired,
      count   : PropTypes.number,
      children: PropTypes.array,
    })),
    value   : PropTypes.arrayOf(PropTypes.string),
    onCancel: PropTypes.func,
    onApply : PropTypes.func,
    t       : PropTypes.func.isRequired,
  };

  static defaultProps = {
    tree    : [],
    value   : [],
    onCancel: noop,
    onApply : noop,
  };

  state = {
    sValue: this.props.value,
    term  : '',
  };

  handleTermChangeDebounced = debounce(val => {
    this.setState({ term: val });
  }, 200);

  handleTermChange = e => {
    this.handleTermChangeDebounced(e.target.value);
  };

  componentDidMount() {
    if (this.activeRef) {
      scrollIntoView(this.activeRef, {
        time       : 150,
        validTarget: (target, parentsScrolled) => (parentsScrolled < 1),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ sValue: this.props.value });
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

  handleActiveRef = ref => {
    this.activeRef = ref;
  };

  handleClick = (e, data) => {
    const depth       = data['data-level'] - 2;
    const isCallApply = data['is-last-leaf'] === 'true';

    if (depth < 0) {
      this.setState({ sValue: [] });
      return;
    }

    if (this.state.term) {
      const path   = this.tracepath(this.props.tree[0], data.name);
      const sValue = path.slice(1);
      if (isCallApply) {
        this.props.onApply(sValue);
      } else {
        this.setState({ sValue });
      }

      return;
    }

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
    const isLastLeaf             = (!node.children || node.children.length === 0).toString();

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
      <div
        key={value}
        ref={ref}
        className={`l${level} px-3 py-2 cursor-pointer hover:bg-gray-100 ${active ? 'bg-blue-50 font-semibold' : ''}`}
        onClick={e => this.handleClick(e, { name: value, 'data-level': level, 'is-last-leaf': isLastLeaf })}
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
      </div>
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

    const root  = tree[0];
    const nodes = [root];
    const items = [this.nodeToItem(root, 1)];

    if (term) {
      const reg          = getEscapedRegExp(term);
      const selected     = Array.isArray(sValue) && sValue.length > 0 ? sValue[sValue.length - 1] : null;
      const filteredRoot = this.filterNode(root, reg, selected);

      return filteredRoot ? this.nodeToItemRec(filteredRoot, 1, reg) : items;
    }

    selection.forEach((x, i) => {
      const node = nodes[nodes.length - 1].children.find(y => y.value === x);
      nodes.push(node);
      items.push(this.nodeToItem(node, 2 + i));
    });

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
      <div className="filter-popup__wrapper border rounded">
        <div className="filter-popup__header bg-gray-100 p-3">
          <div className="title">
            <button
              className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
              onClick={this.onCancel}
            >
              {t('buttons.cancel')}
            </button>
            <h4 className="small font-semibold text-center flex-1">{t(`filters.${name}.label`)}</h4>
            <button
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={this.apply}
            >
              {t('buttons.apply')}
            </button>
          </div>
          <div className="relative autocomplete">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 large">search</span>
            <input
              type="text"
              className="w-full pl-8 pr-3 py-1.5 small border border-gray-300 rounded"
              placeholder={`${t('buttons.search')}...`}
              onChange={this.handleTermChange}
            />
          </div>
        </div>
        <div className="filter-popup__body p-3">
          <nav className="flex flex-col w-full small hierarchy">
            {this.getFlatList()}
          </nav>
        </div>
      </div>
    );
  }
}

export default HierarchicalFilter;
