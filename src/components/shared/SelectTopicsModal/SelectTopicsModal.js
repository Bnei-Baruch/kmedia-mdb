import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Input, Modal, Header, Label, Icon, Container } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/tags';
import isEqual from 'react-fast-compare';
import TopicBranch from './TopicBranch';
import { getTree } from '../../../helpers/topricTree';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_LABELS } from '../../../helpers/consts';
import AlertModal from '../AlertModal';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';

const SelectTopicsModal = ({ t, open, onClose, source, trigger }) => {
  const [selected, setSelected] = useState([])
  const [match, setMatch] = useState('');
  const [name, setName] = useState('');
  const [alertMsg, setAlertMsg] = useState();

  const roots = useSelector(state => selectors.getDisplayRoots(state.tags), isEqual) || [];
  const getTagById = useSelector(state => selectors.getTagById(state.tags));
  const tree = useMemo(() => getTree(roots, getTagById, null, t)[0], [roots, getTagById, t]);

  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const { language = uiLanguage } = source.properties;
  const dir = getLanguageDirection(language);

  const dispatch = useDispatch();

  const create = () => {

    const params = { name, tag_uids: selected, language, ...source };

    dispatch(actions.add(MY_NAMESPACE_LABELS, params));
  };

  const renderColumn = col => (
    <Grid.Column key={col.value}>
      <Header
        as="h2"
        content={col.text}
        className="topic_row_title"
      />
      {
        col.children.map(r => (
          <TopicBranch
            key={r.value}
            match={match}
            root={r}
            selected={selected}
            setSelected={setSelected}
          />
        ))
      }
    </Grid.Column>
  )


  const handleFilterChange = (e, data) => setMatch(data.value);

  const handleSetName = (e, data) => setName(data.value);

  const handleSave = () => {
    create()
    setAlertMsg(t('personal.label.labelCreated'));
  };

  const handleAlertClose = () => {
    setAlertMsg(null);
    onClose();
  }

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose}/>
      <Modal
        open={open}
        onClose={onClose}
        size="large"
        trigger={trigger}
        dir={dir}
        className="select_topic_modal"
      >
        <Modal.Header content={t('personal.label.header')}/>
        <Modal.Content className="padded">
          <Input
            defaultValue={name}
            onChange={handleSetName}
            size="mini"
            fluid
          >
            <Label
              content={t('personal.label.name')}
              basic
              className="no-border"
            />
            <input className="no-padding"/>
          </Input>
        </Modal.Content>
        <Modal.Content className="padded">
          <Container as="h3" className="font-normal" content={t('personal.label.infoAddTag')}/>
          <Input
            icon="search"
            className="search-omnibox"
            placeholder={t('personal.label.search')}
            onChange={handleFilterChange}
          />
        </Modal.Content>
        <Modal.Content scrolling>
          <Grid columns={tree?.children.length}>
            <Grid.Row>
              {tree?.children.map(renderColumn)}
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={handleSave}
            content={t('topic.select')}
            color="green"
            disabled={!selected.length || !name}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

SelectTopicsModal.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default withNamespaces()(SelectTopicsModal);
