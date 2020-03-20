import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Divider, Header, List } from 'semantic-ui-react';

import { canonicalLink } from '../../../../../helpers/links';
import { isEmpty } from '../../../../../helpers/utils';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions, selectors } from '../../../../../redux/modules/lessons';
import NavLink from '../../../../Language/MultiLanguageNavLink';
import WipErr from '../../../../shared/WipErr/WipErr';

const renderTree = (nodes, level) => (
  nodes || []).map((x) => {
  const { name, items } = x;

  if (isEmpty(items)) {
    return (
      <List.Item key={name} as={NavLink} to={canonicalLink(x)} content={name} />
    );
  }

  return (
    <List.Item key={name}>
      <Header as={`h${level + 2}`} content={name} />
      <List.List>
        {renderTree(items, level + 1)}
      </List.List>
    </List.Item>
  );
});

const SeriesContainer = ({ fetchAll, t }) => {
  const bySource = useSelector(state => selectors.getSeriesBySource(state.lessons, state.mdb, state.sources)) || [];
  const language = useSelector(state => settings.getLanguage(state.settings));
  const wip      = useSelector(state => selectors.getWip(state.lessons).series);
  const err      = useSelector(state => selectors.getErrors(state.lessons).series);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(bySource) && !(wip || err)) {
      dispatch(actions.fetchAllSeries());
    }
  }, [bySource, wip, err, language, dispatch]);

  const content = WipErr({ wip, err, t }) || (
    <Container className="padded">
      <List relaxed="very">
        {renderTree(bySource, 0)}
      </List>
    </Container>
  );

  return (
    <div>
      <Divider fitted />
      {content}
    </div>
  );
};

SeriesContainer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SeriesContainer);
