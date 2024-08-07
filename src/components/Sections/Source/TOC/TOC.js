import React, { useState, useEffect, useContext } from 'react';
import { Accordion } from 'semantic-ui-react';

import { getEscapedRegExp, isEmpty, noop } from '../../../../helpers/utils';
import { BS_SHAMATI, RH_ARTICLES, RH_RECORDS, } from '../../../../helpers/consts';
import { isLanguageRtl } from '../../../../helpers/i18n-utils';
import { useSelector, useDispatch } from 'react-redux';
import { properParentId, getFullPath } from '../helper';
import { useNavigate } from 'react-router-dom';
import TOCSearch from './TOCSearch';
import TOCControl from './TOCControl';
import clsx from 'clsx';
import {
  textPageGetTocIsActiveSelector,
  textPageGetTocInfoSelector,
  textPageGetSubjectSelector,
  textPageGetUrlInfoSelector,
  textPageGetScrollDirSelector,
  settingsGetUILangSelector,
  sourcesGetSourceByIdSelector,
  sourcesGetPathByIDSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';
import { actions } from '../../../../redux/modules/textPage';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

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
  if (activeId === undefined) {
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
      const name = el.leafTitle.replace(reg, '<span class="blue text">$&</span>');
      acc.push({ leafId: el.leafId, leafTitle: name });
    }

    return acc;
  }, []);
};

const TOC = () => {
  const getPathByID        = useSelector(sourcesGetPathByIDSelector);
  const getSourceById      = useSelector(sourcesGetSourceByIdSelector);
  const uiLang             = useSelector(settingsGetUILangSelector);
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const { match }          = useSelector(textPageGetTocInfoSelector);
  const tocIsActive        = useSelector(textPageGetTocIsActiveSelector);
  const scrollDir          = useSelector(textPageGetScrollDirSelector);
  const { id }             = useSelector(textPageGetSubjectSelector);
  const hasSel             = !!useSelector(textPageGetUrlInfoSelector).select;
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const fullPath                = getFullPath(id, getPathByID);
  const rootId                  = properParentId(fullPath);
  const [activeId, setActiveId] = useState(fullPath[fullPath.length - 1].id);
  const navigate                = useNavigate();
  const dispatch                = useDispatch();

  const [tocScrollHeight, setTocScrollHeight] = useState(0);

  const activeIndex = getIndex(fullPath[1], fullPath[2]);

  useEffect(() => {
    tocIsActive && scrollToActive(id);
  }, [id, tocIsActive]);

  useEffect(() => {
    if (!isMobileDevice) return noop;
    const handleResize = () => setTocScrollHeight(window.visualViewport?.height - 130);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileDevice]);

  if (activeIndex === -1) {
    return null;
  }

  const isRTL = isLanguageRtl(uiLang);

  const subToc = (subTree, path) => (
    subTree.map(sourceId => (getToc(sourceId, path)?.toc))
  );

  const leaf = (id, title) => {
    const props = {
      id: titleKey(id),
      key: titleKey(id),
      active: id === activeId,
      onClick: e => selectSourceById(id, e),
    };

    const realTitle = isEmpty(match)
      ? title
      : <span dangerouslySetInnerHTML={{ __html: title }} />;
    return <Accordion.Title {...props}>{realTitle}</Accordion.Title>;
  };

  const getLeafTitle = (leafId, sourceId) => {
    const { name, number, year } = getSourceById(leafId);

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

  const icon   = uiDir === 'ltr' ? 'chevron_right' : 'chevron_left';
  const getToc = (sourceId, path, firstLevel = false) => {
    // 1. Element that has children is CONTAINER
    // 2. Element that has NO children is NOT CONTAINER (though really it may be an empty container)
    // 3. If all children of the first level element are NOT CONTAINERS, than it is also NOT CONTAINER

    const { name: title, children } = getSourceById(sourceId);

    if (isEmpty(children)) { // Leaf
      const item   = leaf(sourceId, title);
      const result = { as: 'span', title: item, key: `lib-leaf-${sourceId}` };
      return { toc: result };
    }

    const hasNoGrandsons = children.reduce((acc, curr) => acc && isEmpty(getSourceById(curr).children), true);
    let panels;
    let className        = '';
    if (hasNoGrandsons) {
      className  = 'toc_last_level';
      const tree = children.reduce((acc, leafId) => {
        const leafTitle = getLeafTitle(leafId, sourceId);

        acc.push({ leafId, leafTitle });
        return acc;
      }, []);

      panels = filterSources(tree, match).map(({ leafId, leafTitle, }) => ({
        title: leaf(leafId, leafTitle, match),
        key: `lib-leaf-${leafId}`
      }));
    } else {
      panels = subToc(children, path.slice(1)).reduce((acc, _item, index) => {
        if (_item.key?.startsWith('lib-leaf')) {
          acc.push(_item);
        } else {
          const { content, title: name } = _item;
          acc.push({ title: name, content, key: `root-${index}-${title}` });
        }

        return acc;
      }, []);
    }

    if (firstLevel) {
      return { toc: panels, className: 'toc_single_level' };
    }

    const activeIndex = getIndex(path[0], path[1]);
    const toc         = {
      title: {
        content: title,
        icon: <span className="material-symbols-outlined">{icon}</span>
      },
      content: {
        content: (
          <Accordion.Accordion
            className={className}
            panels={panels}
            defaultActiveIndex={activeIndex}
            onTitleClick={handleTitleClick}
          />
        ),
        key: `lib-content-${sourceId}`,
      }
    };
    return { toc };
  };

  const selectSourceById = (id, e) => {
    e.preventDefault();
    if (document.body.clientWidth < 1201) {
      dispatch(actions.setTocIsActive(false));
    }

    navigate(`../sources/${id}`);
    setActiveId(id);
  };

  const path               = fullPath.slice(1); // Remove first element (i.e. kabbalist)
  const { toc, className } = getToc(rootId, path, true);

  const tocScrollStyle = tocScrollHeight && isMobileDevice ? { 'height': tocScrollHeight } : {};
  return (
    <div className={
      clsx('toc no_print',
        {
          'toc_active': tocIsActive,
          'toc_scroll_up': scrollDir > 0,
          'toc_scroll_down': scrollDir === -1,
          'toc_selected': hasSel,
        }
      )
    }>
      <TOCControl />
      {
        !isMobileDevice && <TOCSearch />
      }
      <div className="toc_scroll" style={tocScrollStyle}>
        <div className="toc_scroll_align">
          <Accordion
            fluid
            panels={toc}
            className={className}
            defaultActiveIndex={activeIndex}
            onTitleClick={handleTitleClick}
          />
        </div>
      </div>

      {
        isMobileDevice && <TOCSearch />
      }
    </div>
  );
};

export default TOC;
// four wide computer sixteen wide mobile sixteen wide tablet column
// four wide computer sixteen wide mobile sixteen wide tablet column widescreen-only large-screen-only computer-only
// twelve wide computer sixteen wide mobile sixteen wide tablet column source__content-wrapper size0
// twelve wide computer sixteen wide mobile sixteen wide tablet column source__content-wrapper size0
