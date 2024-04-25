import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Container, List } from 'semantic-ui-react';

const ITEMS_NUMBER = 5;

const TopicBranch = ({ leafs, selected, setSelected }) => {
  const { t }                 = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const children = leafs.filter(x => x.matched);

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

    const { text, value, children: leafs } = node;

    return (
      <List.Item key={value}>
        <Checkbox
          checked={selected?.includes(value)}
          onChange={(e, { checked }) => handleChange(checked, value)}
          label={text}
        />
        <TopicBranch
          setSelected={setSelected}
          selected={selected}
          leafs={leafs}
        />
      </List.Item>
    );
  };

  return (
    <>
      <Container className="padded no-padding-top no-padding-bottom">
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
    </>
  );
};

TopicBranch.propTypes = {
  leafs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  setSelected: PropTypes.func.isRequired
};

export default TopicBranch;
