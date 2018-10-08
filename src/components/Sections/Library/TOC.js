import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Ref, Sticky } from 'semantic-ui-react';

import { BS_SHAMATI, RH_ARTICLES, RH_RECORDS, RTL_LANGUAGES, } from '../../../helpers/consts';
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
    contextRef: PropTypes.object,
    getSourceById: PropTypes.func.isRequired,
    apply: PropTypes.func.isRequired,
    stickyOffset: PropTypes.number,
    language: PropTypes.string.isRequired,

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

  handleTitleClick = (e, data) => {
    // don't stop propagation on leaf nodes
    const { id = '' } = data;

    if (id.startsWith('title')) {
      return;
    }

    // stop propagation so tocIsActive in LibraryContainer won't call
    // this breaks navigation in nested TOCs (TES, Zohar, etc...)
    e.stopPropagation();
  };

  subToc = (subTree, path) => (
    subTree.map(sourceId => (this.toc(sourceId, path)))
  );

  titleKey = id => `title-${id}`;

  hebrew = (number) => {

    let n = 1 * number;
    switch (n) {
    case 16:
      return 'ט"ז';
    case 15:
      return 'ט"ו';
    default:
    }

    let ret = '';
    while (n >= 400) {
      ret += 'ת';
      n -= 400;
    }
    if (n >= 300) {
      ret += 'ש';
      n -= 300;
    }
    if (n >= 200) {
      ret += 'ר';
      n -= 200;
    }
    if (n >= 100) {
      ret += 'ק';
      n -= 100;
    }
    if (n >= 10) {
      ret += 'יכלמנסעפצ'.slice((n / 10) - 1)[0];
      n %= 10;
    }
    if (n > 0) {
      ret += 'אבגדהוזחט'.slice((n % 10) - 1)[0];
    }

    if (ret.length > 1) {
      ret = `${ret.slice(0, 1)}"${ret.slice(1)}`;
    }

    return ret;
  };

  leaf = (id, title, match) => {
    const props = {
      id: this.titleKey(id),
      key: this.titleKey(id),
      active: id === this.state.activeId,
      onClick: e => this.selectSourceById(id, e),
    };

    const realTitle = isEmpty(match) ?
      title :
      <span dangerouslySetInnerHTML={{ __html: title }} />;
    return <Accordion.Title {...props}>{realTitle}</Accordion.Title>;
  };

  toc = (sourceId, path, firstLevel = false) => {
    // 1. Element that has children is CONTAINER
    // 2. Element that has NO children is NOT CONTAINER (though really it may be an empty container)
    // 3. If all children of the first level element are NOT CONTAINERS, than it is also NOT CONTAINER

    const { getSourceById, language } = this.props;
    const isRTL                       = RTL_LANGUAGES.includes(language);

    const { name: title, children } = getSourceById(sourceId);

    if (isEmpty(children)) { // Leaf
      const item   = this.leaf(sourceId, title);
      const result = { as: 'span', title: item, key: `lib-leaf-${sourceId}` };
      return [result];
    }

    const hasNoGrandsons = children.reduce((acc, curr) => acc && isEmpty(getSourceById(curr).children), true);
    let panels;
    if (hasNoGrandsons) {
      const tree = children.reduce((acc, leafId) => {
        const { name, number, year } = getSourceById(leafId);
        let leafTitle                = name;
        if (sourceId === BS_SHAMATI) {
          leafTitle = isRTL ? `${this.hebrew(number)}. ${name}` : `${number}. ${name}`;
        } else if (sourceId === RH_RECORDS) {
          leafTitle = `${number}. ${name}`;
        } else if (sourceId === RH_ARTICLES) {
          leafTitle = `${name}. ${number} (${year})`;
        }
        acc.push({ leafId, leafTitle });
        return acc;
      }, []);

      const { match } = this.props;
      panels          = this.filterSources(tree, match).map(({ leafId, leafTitle, }) => ({
        title: this.leaf(leafId, leafTitle, match),
        key: `lib-leaf-${leafId}`
      }));
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
        content: (
          <Accordion.Accordion
            panels={panels}
            defaultActiveIndex={activeIndex}
            onTitleClick={this.handleTitleClick}
          />
        ),
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
    const element      = document.getElementById(this.titleKey(activeId));
    if (element === null) {
      return;
    }
    element.scrollIntoView();
    window.scrollTo(0, 0);
  };

  filterSources = (path, match) => {
    if (isEmpty(match)) {
      return path;
    }

    // We don't check validity of regular expression,
    // so let's escape all special symbols
    const escapedMatch = match.replace(/[/)(.+\\]/g, '\\$&');
    const reg          = new RegExp(escapedMatch, 'i');
    return path.reduce((acc, el) => {
      if (reg.test(el.leafTitle)) {
        const name = el.leafTitle.replace(reg, '<em class="blue text">$&</em>');
        acc.push({ leafId: el.leafId, leafTitle: name });
      }
      return acc;
    }, []);
  };

  render() {
    const { fullPath, rootId, contextRef, stickyOffset } = this.props;

    const activeIndex = this.getIndex(fullPath[1], fullPath[2]);
    if (activeIndex === -1) {
      return null;
    }

    const path = fullPath.slice(1); // Remove first element (i.e. kabbalist)
    const toc  = this.toc(rootId, path, true);

    return (
      <Sticky context={contextRef} offset={stickyOffset} className="source__toc">
        <Ref innerRef={this.handleAccordionContext}>
          <Accordion fluid panels={toc} defaultActiveIndex={activeIndex} onTitleClick={this.handleTitleClick} />
        </Ref>
      </Sticky>
    );
  }
}

export default TOC;
