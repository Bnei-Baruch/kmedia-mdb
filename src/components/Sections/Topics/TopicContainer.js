import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import produce from 'immer';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Container, Divider, Grid, Header, Input, List } from 'semantic-ui-react';
import { selectors as topicsSelectors } from '../../../redux/modules/tags';
import { getEscapedRegExp, isNotEmptyArray } from '../../../helpers/utils';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';
import { FN_TOPICS_MULTI, TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { actions, selectors as filtersAside } from '../../../redux/modules/filtersAside';

const namespace = 'topics';

const hasChildren = node => node && isNotEmptyArray(node.children);

export const sortRootsPosition = roots => {
  const extra = roots.filter(node => !TOPICS_FOR_DISPLAY.includes(node));

  return roots.length ? [...TOPICS_FOR_DISPLAY, ...extra] : roots;
};

const getAllVisibleById = (byId, expandedNodes) => {
  const visibleItemsCount = 3;
  const list              = produce(byId || {}, draft => {
    Object.keys(draft).forEach(key => {
      const { id, parent_id } = draft[key];

      // make node visible when its parent is in expandedNodes and its index less then visible items count
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

  // filter objects
  Object.keys(byId).forEach(key => {
    const { label, parent_id } = byId[key];

    // add object that includes the match
    if (label && regExp.test(label)) {
      filteredById[key] = { ...byId[key], visible: true };

      // keep its parent_id key
      if (parent_id) {
        parentIdsArr.push(parent_id);
      }
    }
  });

  // add grand parents ids till the root to parentIdsArr
  const displayRootIndexes = []; // to keep the same order of the roots
  let i                    = 0;
  let index;
  while (i < parentIdsArr.length) {
    const { id, parent_id } = byId[parentIdsArr[i]];

    // keep displayRoot index for the order of the roots
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

  // add the parents to filteredById
  parentIdsArr.forEach(parentKey => {
    filteredById[parentKey] = byId[parentKey];
  });

  return [filteredById, filteredRoots];
};

/* root will be main title
  subroot will be subtitle
  the rest will be a tree - List of Lists */
const TopicContainer = ({ t }) => {
  const statsById = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_TOPICS_MULTI));
  const roots     = useSelector(state => topicsSelectors.getDisplayRoots(state.tags), isEqual) || [];
  const byId      = useSelector(state => topicsSelectors.getTags(state.tags), isEqual);

  const [match, setMatch]                 = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchStats(namespace, {}, { isPrepare: true, countC: true, countL: true }));
  }, [dispatch]);

  const handleFilterChange = debounce((e, data) => {
    setMatch(data.value);
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

  // run filter
  const [filteredById, filteredRoots] = filterTagsById();

  const isIncluded = id => !!filteredById[id];

  const handleShowMoreClick = nodeId => {
    setExpandedNodes(expNodes => {
      // a new set has to be created to update the state
      const newSet = new Set(expNodes);

      newSet.has(nodeId)
        ? newSet.delete(nodeId)
        : newSet.add(nodeId);

      return newSet;
    });
  };

  const renderLeaf = node => {
    const s = statsById(node.id);
    return <Link to={`/topics/${node.id}`}>
      {node.label}
      {s ? ` (${s})` : ''}
    </Link>;
  };

  const renderNode = (node, grandchildrenClass = '') => {
    if (!node) {
      return null;
    }

    const { id, label, children } = node;
    const showExpandButton        = children?.length > 3;
    const expanded                = expandedNodes.has(id);

    return (
      <Fragment key={`f-${id}`}>
        {
          isNotEmptyArray(children)
            ? (
              <div key={id} className={`topics__card ${grandchildrenClass}`}>
                <Header as="h4" className="topics__subtitle">
                  <Link to={`/topics/${id}`}>
                    {label}
                  </Link>
                </Header>
                <List>
                  {
                    children
                      .filter(isIncluded)
                      .map(cId => (
                        <List.Item key={cId} className={filteredById[cId].visible ? '' : 'hide-topic'}>
                          {renderNode(filteredById[cId], 'grandchildren')}
                        </List.Item>
                      ))
                  }
                </List>
                {
                  showExpandButton &&
                  <Button
                    basic
                    icon={expanded ? 'minus' : 'plus'}
                    className={`topics__button ${showExpandButton ? '' : 'hide-button'}`}
                    size="mini"
                    content={t(`topics.show-${expanded ? 'less' : 'more'}`)}
                    onClick={() => handleShowMoreClick(id)}
                  />
                }
              </div>
            )
            : renderLeaf(node)
        }
      </Fragment>
    );
  };

  const renderSubHeader = node => hasChildren(node) ? renderNode(node) : null;

  const renderBranch = rootId => {
    const rootNode = filteredById[rootId];

    return rootNode?.children?.length > 0
      ? <Grid.Column key={rootId} className="topics__section">
        <Header as="h2" className="topics__title">
          {rootNode.label}
        </Header>
        <div className="topics__list">
          {
            rootNode.children
              .filter(isIncluded)
              .map(id => renderSubHeader(filteredById[id]))
          }
        </div>
      </Grid.Column>
      : null;
  };

  return (
    <>
      <SectionHeader section="topics" />
      <Divider fitted />
      <Container className="padded">
        <Input
          fluid
          size="large"
          icon="search"
          className="search-omnibox"
          placeholder={t('sources-library.filter')}
          onChange={handleFilterChange}
          onKeyDown={handleFilterKeyDown}
        />
      </Container>
      <Container className="padded">
        <Grid columns={3}>
          <Grid.Row>
            {filteredRoots.map(r => renderBranch(r))}
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
};

TopicContainer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TopicContainer);
