import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Input, Label, Modal } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { selectors as sourcesSelectors } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors } from '../../../redux/modules/tags';
import { actions } from '../../../redux/modules/my';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { MY_NAMESPACE_LABELS } from '../../../helpers/consts';
import { getTree } from '../../../helpers/topricTree';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import AlertModal from '../AlertModal';
import TopicBranch from './TopicBranch';

const SelectTopicsModal = ({ t, open, onClose, source, trigger }) => {
  const [selected, setSelected] = useState([]);
  const [match, setMatch]       = useState('');
  const [name, setName]         = useState('');
  const [alertMsg, setAlertMsg] = useState();

  const areSourcesLoaded = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));
  const roots            = useSelector(state => selectors.getDisplayRoots(state.tags), isEqual) || [];
  const getTagById       = useSelector(state => selectors.getTagById(state.tags));
  const tree             = useMemo(() => getTree(roots, getTagById, null, t)[0], [roots.length, getTagById, t]);

  const language  = useSelector(state => settings.getLanguage(state.settings));
  const dir          = getLanguageDirection(language);

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
        className="topic_row_title topics__title"
      />
      {
        col.children?.map(r => (
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
  );

  const handleFilterChange = (e, data) => setMatch(data.value);

  const handleSetName = (e, data) => setName(data.value);

  const handleSave = () => {
    create();
    onClose();
    setAlertMsg(t('personal.label.labelCreated'));
  };

  const handleAlertClose = () => setAlertMsg(null);

  const needToLogin = NeedToLogin({ t });

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose} dir={dir} />
      <Modal
        open={open}
        onClose={onClose}
        className="select_topic_modal"
        size="large"
        trigger={trigger}
        dir={dir}
      >
        <Modal.Header content={t('personal.label.header')} className="no-border" />
        {
          !!needToLogin ?
            (
              <Modal.Content>{needToLogin}</Modal.Content>
            ) : (
              <>
                <Modal.Content style={{ paddingTop: 0 }}>
                  <Input
                    defaultValue={name}
                    onChange={handleSetName}
                    fluid
                    className="label_name"
                    error={selected.length > 0 && !name}
                  >
                    <Label
                      content={t('personal.label.name')}
                      basic
                      className="no-border"
                    />
                    <input autoFocus />
                  </Input>
                </Modal.Content>
                <Modal.Content style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Container as="h4" className="font-normal" content={t('personal.label.infoAddTag')} />
                  <Input
                    className="search-omnibox"
                    placeholder={t('personal.label.search')}
                    onChange={handleFilterChange}
                  />
                </Modal.Content>
                <Modal.Content scrolling className="label_topic_grid">
                  {
                    tree?.children && (
                      <Grid columns={tree.children.length}>
                        <Grid.Row>
                          {
                            areSourcesLoaded && tree.children.map(renderColumn)
                          }
                        </Grid.Row>
                      </Grid>
                    )
                  }
                </Modal.Content>
              </>
            )
        }
        <Modal.Actions>
          <Button
            onClick={handleAlertClose}
            content={t('buttons.cancel')}
          />
          <Button
            onClick={handleSave}
            content={t('personal.label.tagging')}
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
