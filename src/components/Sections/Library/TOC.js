import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Ref, Sticky } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';
import { noop } from '../../../helpers/utils';

import { BS_SHAMATI, RH_ARTICLES, RH_RECORDS, } from '../../../helpers/consts';
import { getEscapedRegExp, isEmpty } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { Reference } from '../../shapes';
import clsx from 'clsx';

const titleKey = id => `title-${id}`;

const hebrew = number => {
  let n = 1 * number;
  switch (n) {
    case 16:
      return 'טז';
    case 15:
      return 'טו';
    default:
      break;
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

  switch (n) {
    case 16:
      ret += 'טז';
      break;
    case 15:
      ret += 'טו';
      break;
    default:
      if (n >= 10) {
        ret += 'יכלמנסעפצ'.slice((n / 10) - 1)[0];
        n %= 10;
      }

      if (n > 0) {
        ret += 'אבגדהוזחט'.slice((n % 10) - 1)[0];
      }

      break;
  }

  return ret;
};

export const getIndex = (node1, node2) => {
  if (!node1 || !node2 || !node1.children) {
    return -1;
  }

  return node1.children.findIndex(x => x === node2.id);
};

const scrollToActive = activeId => {
  if (activeId !== undefined) {
    return;
  }

  const element = document.getElementById(titleKey(activeId));
  if (element === null) {
    return;
  }

  element.scrollIntoView();
  window.scrollTo(0, 0);
};

const handleTitleClick = (e, data) => {
  // don't stop propagation on leaf nodes
  const { id = '' } = data;

  if (id.startsWith('title')) {
    return;
  }

  // stop propagation so tocIsActive in LibraryContainer won't call
  // this breaks navigation in nested TOCs (TES, Zohar, etc...)
  e.stopPropagation();
};

const filterSources = (path, match) => {
  if (isEmpty(match)) {
    return path;
  }

  // We don't check validity of regular expression,
  // so let's escape all special symbols
  const escapedMatch = getEscapedRegExp(match);
  const reg          = new RegExp(escapedMatch, 'i');
  return path.reduce((acc, el) => {
    if (reg.test(el.leafTitle)) {
      const name = el.leafTitle.replace(reg, '<em class="blue text">$&</em>');
      acc.push({ leafId: el.leafId, leafTitle: name });
    }

    return acc;
  }, []);
};

class TOC extends Component {
  static propTypes = {
    fullPath: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      full_name: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    rootId: PropTypes.string.isRequired,
    contextRef: Reference,
    getSourceById: PropTypes.func.isRequired,
    apply: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    active: PropTypes.bool,
    match: PropTypes.string.isRequired,
    matchApplied: PropTypes.func,
  };

  static defaultProps = {
    contextRef: null,
    matchApplied: noop,
    active: true
  };

  state = {
    activeId: null,
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { fullPath }                = nextProps;
    const { activeId: stateActiveID } = state;
    const activeId                    = fullPath[fullPath.length - 1].id;
    if (activeId !== stateActiveID) {
      return { activeId };
    }

    return null;
  }

  shouldComponentUpdate(nextProps) {
    const { rootId, match, fullPath, active } = this.props;
    return (
      rootId !== nextProps.rootId
      || match !== nextProps.match
      || !isEqual(fullPath, nextProps.fullPath)
      || (!this.props.contextRef && nextProps.contextRef)
      || active !== nextProps.active
    );
  }

  componentDidUpdate() {
    // make actual TOC content proper height
    const el = document.querySelector('.source__toc > div:nth-child(2)');
    if (el) {
      let { stickyOffset } = this.props;
      if (isNaN(stickyOffset)) {
        stickyOffset = 0;
      }

      el.style.height = `calc(100vh - ${stickyOffset}px)`;
    }

    const { activeId } = this.state;
    scrollToActive(activeId);
  }

  subToc = (subTree, path) => (
    subTree.map(sourceId => (this.toc(sourceId, path)))
  );

  leaf = (id, title, match) => {
    const { activeId } = this.state;
    const props        = {
      id: titleKey(id),
      key: titleKey(id),
      active: id === activeId,
      onClick: e => this.selectSourceById(id, e),
    };

    const realTitle = isEmpty(match)
      ? title
      : <span dangerouslySetInnerHTML={{ __html: title }} />;
    return <Accordion.Title {...props}>{realTitle}</Accordion.Title>;
  };

  getLeafTitle = (leafId, sourceId) => {
    const { getSourceById, language } = this.props;
    const isRTL                       = isLanguageRtl(language);
    const { name, number, year }      = getSourceById(leafId);

    let leafTitle;
    switch (sourceId) {
      case BS_SHAMATI:
        leafTitle = isRTL
          ? `${hebrew(number)}. ${name}`
          : `${number}. ${name}`;
        break;
      case RH_RECORDS:
        leafTitle = `${number}. ${name}`;
        break;
      case RH_ARTICLES:
        leafTitle = `${name}. ${number} (${year})`;
        break;
      default:
        leafTitle = name;
        break;
    }

    return leafTitle;
  };

  toc = (sourceId, path, firstLevel = false) => {
    // 1. Element that has children is CONTAINER
    // 2. Element that has NO children is NOT CONTAINER (though really it may be an empty container)
    // 3. If all children of the first level element are NOT CONTAINERS, than it is also NOT CONTAINER

    const { getSourceById }         = this.props;
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
        const leafTitle = this.getLeafTitle(leafId, sourceId);

        acc.push({ leafId, leafTitle });
        return acc;
      }, []);

      const { match } = this.props;
      panels          = filterSources(tree, match).map(({ leafId, leafTitle, }) => ({
        title: this.leaf(leafId, leafTitle, match),
        key: `lib-leaf-${leafId}`
      }));
    } else {
      panels = this.subToc(children, path.slice(1)).map(({ content, title: name }, index) => ({
        title: name,
        content,
        key: `root-${index}-${title}`
      }));
    }

    if (firstLevel) {
      return panels;
    }

    const activeIndex = getIndex(path[0], path[1]);
    return {
      title,
      content: {
        content: (
          <Accordion.Accordion
            panels={panels}
            defaultActiveIndex={activeIndex}
            onTitleClick={handleTitleClick}
          />
        ),
        key: `lib-content-${sourceId}`,
      }
    };
  };

  selectSourceById = (id, e) => {
    const { apply, matchApplied } = this.props;
    e.preventDefault();
    apply(`sources/${id}`);
    matchApplied();
    this.setState({ activeId: id });
  };

  handleAccordionContext = ref => {
    this.accordionContext = ref;
  };

  render() {
    const { fullPath, rootId, contextRef, active } = this.props;

    const activeIndex = getIndex(fullPath[1], fullPath[2]);

    if (activeIndex === -1) {
      return null;
    }

    const path = fullPath.slice(1); // Remove first element (i.e. kabbalist)
    const toc  = this.toc(rootId, path, true);

    return (
      <Sticky
        context={contextRef}
        className={clsx({
          'source__toc': true,
          'mobile-hidden': !active,
          'tablet-hidden': !active,
        })}
        active={active}
      >
        <Ref innerRef={this.handleAccordionContext}>
          <Accordion fluid panels={toc} defaultActiveIndex={activeIndex} onTitleClick={handleTitleClick} />
        </Ref>
      </Sticky>
    );
  }
}

export default TOC;
// four wide computer sixteen wide mobile sixteen wide tablet column
// four wide computer sixteen wide mobile sixteen wide tablet column widescreen-only large-screen-only computer-only
// twelve wide computer sixteen wide mobile sixteen wide tablet column source__content-wrapper size0
// twelve wide computer sixteen wide mobile sixteen wide tablet column source__content-wrapper size0
