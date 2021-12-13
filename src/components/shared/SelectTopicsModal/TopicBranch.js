import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Checkbox, Grid, Header, List } from 'semantic-ui-react';

import { getEscapedRegExp } from '../../../helpers/utils';
import clsx from 'clsx';

const ITEMS_NUMBER = 5;

const TopicBranch = ({ root, match, selected, setSelected, t }) => {
  const [showAll, setShowAll] = useState();
  const regExp                = getEscapedRegExp(match);
  const { label, id: rootId } = root;

  const children = (label && regExp.test(label)) ? root.children
    : root.children.filter(({ label }) => label && regExp.test(label));

  if (!children?.length > 0) return null;

  const handleChange = (checked, id) => {
    if (checked) {
      setSelected([id, ...selected || []]);
    } else {
      setSelected(selected.filter(x => x !== id));
    }
  };

  const handleShowAll = () => setShowAll(!showAll);

  const renderNode = node => {
    if (!node) {
      return null;
    }

    const { id, label } = node;

    return (
      <List.Item key={id}>
        <Checkbox
          checked={selected?.includes(id)}
          onChange={(e, { checked }) => handleChange(checked, id)}
          label={label}
        />
      </List.Item>
    );
  };

  return (
    <Grid.Column key={rootId} className="topics__section">
      <Header as="h2" className="topics__title">
        {label}
      </Header>
      <div className="topics__card">
        <List className="topics__list">
          {
            (showAll ? children : children.slice(0, ITEMS_NUMBER)).map(renderNode)
          }
        </List>
        {
          children.length >= ITEMS_NUMBER && (
            <Button
              basic
              icon={showAll ? 'minus' : 'plus'}
              className="topics__button"
              size="mini"
              content={t(`topics.show-${showAll ? 'less' : 'more'}`)}
              onClick={handleShowAll}
            />
          )
        }
      </div>
    </Grid.Column>
  );
};

TopicBranch.propTypes = {
  t: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  match: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.string),
  setSelected: PropTypes.func.isRequired
};

export default withNamespaces()(TopicBranch);
