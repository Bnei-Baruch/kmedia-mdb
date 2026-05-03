import { produce } from 'immer';
import debounce from 'lodash/debounce';
import React, { Fragment, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FN_TOPICS_MULTI, TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { getEscapedRegExp, isNotEmptyArray } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/filtersAside';
import {
  filtersAsideGetStatsSelector,
  tagsGetDisplayRootsSelector,
  tagsGetTagsSelector
} from '../../../redux/selectors';
import Link from '../../Language/MultiLanguageLink';
import SectionHeader from '../../shared/SectionHeader';

const namespace = 'topics';

const hasChildren = node => node && isNotEmptyArray(node.children);

export const sortRootsPosition = roots => {
  const extra = roots?.filter(node => !TOPICS_FOR_DISPLAY.includes(node));

  return roots?.length ? [...TOPICS_FOR_DISPLAY, ...extra] : roots;
};

const getAllVisibleById = (byId, expandedNodes) => {
  const visibleItemsCount = 3;
  const list              = produce(byId || {}, draft => {
    Object.keys(draft).forEach(key => {
      const { id, parent_id } = draft[key];

      const visible = parent_id
        ? expandedNodes.has(parent_id) || draft[parent_id].children.indexOf(id) < visibleItemsCount
        : true;

      draft[key].visible = visible;
    });
  });

  return list;
};

const filterData = (byId, match, sortedRoots) => {
  const filteredById = {};
  const parentIdsArr = [];
  const regExp       = getEscapedRegExp(match);

  Object.keys(byId).forEach(key => {
    const { label, parent_id } = byId[key];

    if (label && regExp.test(label)) {
      filteredById[key] = { ...byId[key], visible: true };

      if (parent_id) {
        parentIdsArr.push(parent_id);
      }
    }
  });

  const displayRootIndexes = [];
  let i                    = 0;
  let index;
  while (i < parentIdsArr.length) {
    const { id, parent_id } = byId[parentIdsArr[i]];

    if (!parent_id) {
      index = sortedRoots.indexOf(id);
      if (index > -1 && !displayRootIndexes.includes(index)) {
        displayRootIndexes.push(index);
      }
    } else if (!parentIdsArr.includes(parent_id)) {
      parentIdsArr.push(parent_id);
    }

    i++;
  }

  displayRootIndexes.sort();
  const filteredRoots = displayRootIndexes.map(ind => sortedRoots[ind]);

  parentIdsArr.forEach(parentKey => {
    filteredById[parentKey] = { ...byId[parentKey], visible: true };
  });

  return [filteredById, filteredRoots];
};

/* root will become main title
  subroot will become subtitle
  the rest will be a tree - List of Lists */
const TopicContainer = () => {
  const { t } = useTranslation();
  const statsById = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_TOPICS_MULTI));
  const roots     = useSelector(tagsGetDisplayRootsSelector, isEqual) || [];
  const byId      = useSelector(tagsGetTagsSelector, isEqual);

  const [match, setMatch]                 = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchStats(namespace, {}, { isPrepare: true, countC: true, countL: true }));
  }, [dispatch]);

  const handleFilterChange = debounce(e => {
    setMatch(e.target.value);
  }, 100);

  const handleFilterKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      setMatch('');
    }
  };

  const filterTagsById = () => {
    const sortedRoots = sortRootsPosition(roots);

    if (!match) {
      const filteredById = getAllVisibleById(byId, expandedNodes);
      return [filteredById, sortedRoots];
    }

    return filterData(byId, match, sortedRoots);
  };

  const [filteredById, filteredRoots] = filterTagsById();

  const isIncluded = id => !!filteredById[id];

  const isIncludedWithChildren = id => !!filteredById[id] && hasChildren(filteredById[id]);

  const handleShowMoreClick = nodeId => {
    setExpandedNodes(expNodes => {
      const newSet = new Set(expNodes);

      newSet.has(nodeId)
        ? newSet.delete(nodeId)
        : newSet.add(nodeId);

      return newSet;
    });
  };

  const renderLeaf = (node, withStats) => {
    const { id, label } = node;
    const s             = withStats ? statsById(id) : null;

    return <Link to={`/topics/${id}`}>
      {label}
      {s ? ` (${s})` : ''}
    </Link>;
  };

  const renderChildren = node => {
    const { id, children } = node;
    const showExpandButton = children?.length > 3;
    const expanded         = expandedNodes.has(id);

    return (
      <>
        <ul className="list-none pl-4">
          {
            children
              .filter(isIncluded)
              .map(cId => (
                <li key={cId} className={filteredById[cId].visible
                  ? isNotEmptyArray(filteredById[cId].children)
                    ? 'subTopic'
                    : ''
                  : 'hide-topic'}>
                  {renderSubTopic(filteredById[cId])}
                </li>
              ))
          }
        </ul>
        {
          showExpandButton &&
          <button
            className={`topics__button border border-gray-300 rounded px-2 py-1 text-xs bg-white hover:bg-gray-50 inline-flex items-center gap-1 ${showExpandButton ? '' : 'hide-button'}`}
            onClick={() => handleShowMoreClick(id)}
          >
            <span className="material-symbols-outlined text-xs">{expanded ? 'remove' : 'add'}</span>
            {t(`topics.show-${expanded ? 'less' : 'more'}`)}
          </button>
        }
      </>
    );
  };

  const renderSubTopic = node => {
    const { id, children } = node;

    return (
      isNotEmptyArray(children)
        ? (
          <div key={id}>
            {renderLeaf(node, true)}
            {renderChildren(node)}
          </div>
        )
        : renderLeaf(node, true)
    );
  };

  const renderTopicCard = node => {
    if (!node) {
      return null;
    }

    const { id, children } = node;

    return (
      <Fragment key={`f-${id}`}>
        {
          isNotEmptyArray(children)
            ? (
              <div key={id} className="topics__card">
                <h4 className="topics__subtitle">
                  {renderLeaf(node)}
                </h4>
                {renderChildren(node)}
              </div>
            )
            : renderLeaf(node, true)
        }
      </Fragment>
    );
  };

  const renderBranch = rootId => {
    const rootNode = filteredById[rootId];

    return rootNode?.children?.length > 0
      ? <div key={rootId} className="topics__section">
        <h2 className="topics__title">
          {rootNode.label}
        </h2>
        <div className="topics__list">
          {
            rootNode.children
              .filter(isIncludedWithChildren)
              .map(id => renderTopicCard(filteredById[id]))
          }
        </div>
      </div>
      : null;
  };

  return (
    <>
      <SectionHeader section="topics"/>
      <hr className="m-0"/>
      <div className=" px-4 ">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            className="search-omnibox w-full large border border-gray-300 rounded pl-10 pr-3 py-2"
            placeholder={t('sources-library.filter')}
            onChange={handleFilterChange}
            onKeyDown={handleFilterKeyDown}
          />
        </div>
      </div>
      <div className=" px-4 ">
        <div className="grid grid-cols-3 gap-4">
          {filteredRoots.map(r => renderBranch(r))}
        </div>
      </div>
    </>
  );
};


export default TopicContainer;
