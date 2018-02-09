import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Ref, Sticky } from 'semantic-ui-react';

import { BS_SHAMATI } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { isEqual } from '../../../helpers/equals';

class TOC extends Component {
  static propTypes = {
    fullPath: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      full_name: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    rootId: PropTypes.string.isRequired,
    contextRef: PropTypes.object,
    getSourceById: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contextRef: null
  };

  state = {};

  componentWillReceiveProps(nextProps) {
    const { fullPath } = nextProps;
    this.setState({ activeId: fullPath[fullPath.length - 1].id });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
  }

  getIndex = (node1, node2) => {
    if (!node1 || !node2 || !node1.children) {
      return -1;
    }
    return node1.children.findIndex(x => x === node2.id);
  };

  subToc = (subTree, path) => (
    subTree.map(sourceId => (this.toc(sourceId, path)))
  );

  leaf = (id, title) => {
    const props = {
      key: `lib-leaf-item-${id}`,
      onClick: e => this.selectSourceById(id, e),
    };
    return <Accordion.Title {...props} active={id === this.state.activeId}>{title}</Accordion.Title>;
  };

  toc = (sourceId, path, firstLevel = false) => {
    // 1. Element that has children is CONTAINER
    // 2. Element that has NO children is NOT CONTAINER (though really it may be empty container)
    // 3. If all children of first level element are NOT CONTAINERs, than it is also NOT CONTAINER

    const { getSourceById } = this.props;

    const { name: title, children } = getSourceById(sourceId);

    if (isEmpty(children)) { // Leaf
      const item   = this.leaf(sourceId, title);
      const result = { title: item, key: `lib-leaf-${sourceId}` };
      return [result];
    }

    const hasNoGrandsons = children.reduce((acc, curr) => acc && isEmpty(getSourceById(curr).children), true);
    let panels;
    if (hasNoGrandsons) {
      panels = children.map((leafId, idx) => {
        let { name: leafTitle, } = getSourceById(leafId);
        if (sourceId === BS_SHAMATI) {
          leafTitle = `${idx + 1}. ${leafTitle}`;
        }

        const item = this.leaf(leafId, leafTitle);
        return { title: item, key: `lib-leaf-${leafId}` };
      });
    } else {
      panels = this.subToc(children, path.slice(1));
    }

    if (firstLevel) {
      return panels;
    }

    const activeIndex = this.getIndex(path[0], path[1]);
    return {
      title,
      content: {
        content: <Accordion.Accordion panels={panels} defaultActiveIndex={activeIndex} />,
        key: `lib-content-${sourceId}`,
      }
    };
  };

  selectSourceById = (id, e) => {
    e.preventDefault();
    this.setState({ activeId: id });
    this.props.replace(`sources/${id}`);
    window.scrollTo(0, 0);
  };

  render() {
    const { fullPath, rootId, contextRef } = this.props;

    const activeIndex = this.getIndex(fullPath[1], fullPath[2]);
    if (activeIndex === -1) {
      return null;
    }

    const path = fullPath.slice(1); // Remove kabbalist
    const toc  = this.toc(rootId, path, true);

    return (
      <Sticky context={contextRef} offset={144} className="source__toc">
        <Ref innerRef={this.handleAccordionContext}>
          <Accordion fluid panels={toc} defaultActiveIndex={activeIndex} />
        </Ref>
      </Sticky>
    );
  }
}

export default TOC;
