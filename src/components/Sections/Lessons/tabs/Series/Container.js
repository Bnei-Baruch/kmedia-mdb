import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import debounce from 'lodash/debounce';
import { Container, Header, List, Grid, Input, Button } from 'semantic-ui-react';

import { canonicalLink } from '../../../../../helpers/links';
import { isEmpty } from '../../../../../helpers/utils';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions, selectors } from '../../../../../redux/modules/lessons';
import NavLink from '../../../../Language/MultiLanguageNavLink';
import WipErr from '../../../../shared/WipErr/WipErr';
import isEqual from 'react-fast-compare';


const SeriesContainer = ({ t }) => {
  const [match, setMatch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const dataTree = useSelector(state => selectors.getSeriesTree(state, match), isEqual);
  const seriesIDs = useSelector(state => selectors.getSeriesIDs(state.lessons), isEqual);
  const language = useSelector(state => settings.getLanguage(state.settings));
  const wip      = useSelector(state => selectors.getWip(state.lessons).series);
  const err      = useSelector(state => selectors.getErrors(state.lessons).series);

  const visibleItemsCount = 3;

  const handleFilterChange = debounce((e, data) => {
    setMatch(data.value);
  }, 100);

  const handleFilterKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      setMatch('');
    }
  };

  const handleShowMoreClick = nodeId => {
    setExpandedNodes(expNodes => {
      // a new set has to be created to update the state
      const newSet = new Set(expNodes);

      newSet.has(nodeId)
        ? newSet.delete(nodeId)
        : newSet.add(nodeId);

      return newSet;
    })
  };

  const renderNode = (node, level, grandchildrenClass = '', displayNode = true) => {
    if (!node || !displayNode) {
      return null;
    }

    const { id, children, name } = node;

    // expand all levels excluding the leafs
    const expandedLevel = !isEmpty(children) && children.some(ch => !isEmpty(ch.children));
    const showExpandButton = !expandedLevel && children?.length > visibleItemsCount;
    const expanded = expandedNodes.has(id);
    const key = id + '#' + level;

    return (
      <Fragment key={`f-${key}`}>
        {
          isEmpty(children)
            ? <List.Item key={id} as={NavLink} to={canonicalLink(node)} content={name} />
            : (
              <div key={key} className={`topics__card no_height ${grandchildrenClass}`}>
                <Header as={`h${level > 6 ? 6 : level}`} className="topics__subtitle" content={name} />
                <List.List>
                  {
                    // display child node if expanded or its index less than visible items count
                    children.map((n, i) => renderNode(n, level + 1, 'grandchildren', expandedLevel || expanded || i < visibleItemsCount))
                  }
                </List.List>
                {
                  showExpandButton &&
                  <Button
                    basic
                    icon={expanded ? 'minus' : 'plus'}
                    className="topics__button"
                    size="mini"
                    content={t(`topics.show-${expanded ? 'less' : 'more'}`)}
                    onClick={() => handleShowMoreClick(id)}
                  />
                }
              </div>
            )
        }
      </Fragment>
    )
  };

  const getHeader = node => node.id === "byTopics"
    ? t(`lessons.tabs.seriesTree.byTopics`)
    : t(`lessons.tabs.seriesTree.bySourcesOf`) + ' ' + node.name;

  const renderKabbalist = node => {
    if (node?.children?.length > 0){
      const initLevel = 2;

      return (
        <div key={node.id + '#' + initLevel}>
          <Header as={`h${initLevel}`} className="topics__title">
            {getHeader(node)}
          </Header>
          <div className="topics__list">
            <List>
              {
                node.children.map(n => renderNode(n, initLevel + 1))
              }
            </List>
          </div>
        </div>
      )
    }

    return null;
  }

  const orderArray = ['rb', 'ml', 'rh'];

  const sortKabbalists = (k1, k2) => {
    const k1_index = orderArray.indexOf(k1.id);
    const k2_index = orderArray.indexOf(k2.id);

    // place the existing item first
    return k1_index >= 0 && k2_index >= 0
      ? k1_index - k2_index
      : k1_index > k2_index
        ? k1_index
        : k2_index;
  }

  const renderGrid = () => (
    <Grid columns={3} padded>
      <Grid.Row>
        <Grid.Column key='bs#1' className="topics__section">
          {renderKabbalist(dataTree.find(node => node.id === 'bs'))}
        </Grid.Column>
        <Grid.Column key='various#1' className="topics__section">
          {
            dataTree
              .filter(node => node.id !== 'bs' && node.id !== 'byTopics')
              .sort(sortKabbalists)
              .map(renderKabbalist)
          }
        </Grid.Column>
        <Grid.Column key='byTopics#1' className="topics__section">
          {renderKabbalist(dataTree.find(node => node.id === 'byTopics'))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && isEmpty(dataTree) && isEmpty(seriesIDs)) {
      dispatch(actions.fetchAllSeries());
    }
  }, [dataTree, wip, err, language, dispatch, seriesIDs]);

  const wipErr = WipErr({ wip, err, t });

  if (wipErr) {
    return wipErr;
  }

  return (
    <>
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
      {
        !isEmpty(dataTree) && renderGrid()
      }
    </>
  )
};

SeriesContainer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SeriesContainer);
