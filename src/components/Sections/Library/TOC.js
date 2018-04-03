import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Ref, Sticky } from 'semantic-ui-react';

import { BS_SHAMATI } from '../../../helpers/consts';
import { isEmpty, shallowEqual } from '../../../helpers/utils';

class TOC extends Component {
  static propTypes = {
    fullPath: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      full_name: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    rootId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    contextRef: PropTypes.object,
    getSourceById: PropTypes.func.isRequired,
    apply: PropTypes.func.isRequired,
    stickyOffset: PropTypes.number,
    
    match: PropTypes.string.isRequired,
    matchApplied: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contextRef: null,
    stickyOffset: 144, // 60 + 70 + 14 (top navbar + library secondary header + 1em)
  };

  state = {};

  componentWillReceiveProps(nextProps) {
    const { fullPath } = nextProps;
    const activeId     = fullPath[fullPath.length - 1].id;
    if (activeId !== this.state.activeId) {
      this.setState({ activeId });
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.rootId !== nextProps.rootId ||
      this.props.match !== nextProps.match ||
      this.props.stickyOffset !== nextProps.stickyOffset ||
      !shallowEqual(this.props.fullPath, nextProps.fullPath)
    );
  }

  componentDidUpdate() {
    // make actual TOC content proper height
    const el = document.querySelector('.source__toc > div:nth-child(2)');
    if (el) {
      console.log('TOC.componentDidUpdate', this.props.stickyOffset);
      el.style.height = `calc(100vh - ${this.props.stickyOffset}px)`;
    }
    this.scrollToActive();
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

    return <Accordion.Title {...props} active={id === this.state.activeId} id={`title-${id}`}>{title}</Accordion.Title>;
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
      const tree = children.reduce((acc, leafId, idx) => {
        let { name } = getSourceById(leafId);
        if (sourceId === BS_SHAMATI) {
          name = `${idx + 1}. ${name}`;
        }
        acc.push({ leafId, leafTitle: name });
        return acc;
      }, []);

      panels = this.filterSources(tree).map(({ leafId, leafTitle, }) => {
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
    this.props.apply(`sources/${id}`);
    this.props.matchApplied();
    this.setState({ activeId: id });
  };

  scrollToActive = () => {
    const { activeId } = this.state;
    const element      = document.getElementById(`title-${activeId}`);
    if (element === null) {
      return;
    }
    element.scrollIntoView();
    window.scrollTo(0, 0);
  };

  filterSources = (path) => {
    const { match } = this.props;

    if (isEmpty(match)) {
      return path;
    }

    const reg = new RegExp(match, 'i');
    return path.reduce((acc, el) => {
      if (reg.test(el.leafTitle)) {
        acc.push(el);
      }
      return acc;
    }, []);
  };

  render() {
    const { fullPath, rootId, contextRef, stickyOffset } = this.props;

console.log('TOC.render', stickyOffset);

    const activeIndex = this.getIndex(fullPath[1], fullPath[2]);
    if (activeIndex === -1) {
      return null;
    }

    const path = fullPath.slice(1); // Remove kabbalist
    const toc  = this.toc(rootId, path, true);

    return (
      <Sticky context={contextRef} offset={stickyOffset} className="source__toc">
        <Ref innerRef={this.handleAccordionContext}>
          <Accordion fluid panels={toc} defaultActiveIndex={activeIndex} />
        </Ref>
      </Sticky>
    );
  }
}

export default TOC;
