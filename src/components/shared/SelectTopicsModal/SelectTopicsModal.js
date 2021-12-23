import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Grid, Input, Modal } from 'semantic-ui-react';

import { selectors as topicsSelectors } from '../../../redux/modules/tags';
import isEqual from 'react-fast-compare';
import TopicBranch from './TopicBranch';

const flatRecursive = (root, byId, acc) => {
  const { children, ...result } = root;
  if (!(children?.length > 0))
    return acc;
  result.children = [];
  root.children.forEach(id => {
    const ch = byId[id];
    if (ch.children?.length > 0) {
      flatRecursive(ch, byId, acc);
    } else {
      result.children.push(ch);
    }
  });
  if (result.children.length > 0)
    acc.push(result);
  return acc;
};

const SelectTopicsModal = ({ t, open, onClose, selected, setSelected }) => {
  const rootIds = useSelector(state => topicsSelectors.getDisplayRoots(state.tags), isEqual) || [];
  const byId    = useSelector(state => topicsSelectors.getTags(state.tags), isEqual);
  const flatten = flatRecursive({ children: rootIds }, byId, []);

  const [match, setMatch] = useState('');

  const handleFilterChange = (e, data) => setMatch(data.value);

  const handleClose = () => {
    onClose(selected);
    setMatch('');
    //setSelected([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
    >
      <Modal.Content className="padded">
        <Input
          fluid
          size="large"
          icon="search"
          className="search-omnibox"
          placeholder={t('sources-library.filter')}
          onChange={handleFilterChange}
        />
      </Modal.Content>
      <Modal.Content scrolling>
        <Grid columns={3}>
          <Grid.Row>
            {flatten.map(r => <TopicBranch match={match} root={r} selected={selected} setSelected={setSelected} />)}
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={handleClose}
          content={t('topic.select')}
        />
      </Modal.Actions>
    </Modal>
  );
};

SelectTopicsModal.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default withNamespaces()(SelectTopicsModal);
