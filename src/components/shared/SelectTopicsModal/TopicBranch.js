import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Checkbox, Container, Grid, Header, List } from 'semantic-ui-react';

import { getEscapedRegExp } from '../../../helpers/utils';
import clsx from 'clsx';

const ITEMS_NUMBER = 5;

const TopicBranch = ({ root, match, selected, setSelected, t }) => {
  const [showAll, setShowAll] = useState();
  const regExp = getEscapedRegExp(match);
  const { text, value } = root;

  const children = (text && regExp.test(text)) ? root.children
    : root.children.filter(({ text }) => text && regExp.test(text));

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

    const { text, value } = node;

    return (
      <List.Item key={value}>
        <Checkbox
          checked={selected?.includes(value)}
          onChange={(e, { checked }) => handleChange(checked, value)}
          label={text}
        />
      </List.Item>
    );
  };

  return (
    <Grid.Column key={value} className="topics_card">
      <Header as="h3" className="topics_title">
        {text}
      </Header>
      <Container className="padded">
        <List className="topics__list">
          {
            (showAll ? children : children.slice(0, ITEMS_NUMBER)).map(renderNode)
          }
        </List>
        {
          children.length >= ITEMS_NUMBER && (
            <Button
              basic
              icon={{ name: showAll ? 'minus' : 'plus', color: 'blue' }}
              className="topics_button clear_button"
              content={t(`topics.show-${showAll ? 'less' : 'more'}`)}
              onClick={handleShowAll}
            />
          )
        }
      </Container>
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
