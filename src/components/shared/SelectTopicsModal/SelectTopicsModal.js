import React, { useMemo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Input, Label, Modal } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { selectors as sourcesSelectors } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors } from '../../../redux/modules/tags';
import { getTree } from '../../../helpers/topricTree';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import AlertModal from '../AlertModal';
import TopicBranch from './TopicBranch';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { actions as mdbActions } from '../../../redux/modules/mdb';

const SelectTopicsModal = ({ t, open, onClose, label, trigger }) => {
  const [selected, setSelected] = useState([]);
  const [match, setMatch]       = useState('');
  const [name, setName]         = useState('');
  const [alertMsg, setAlertMsg] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const areSourcesLoaded = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));
  const roots            = useSelector(state => selectors.getDisplayRoots(state.tags), isEqual) || [];
  const getTagById       = useSelector(state => selectors.getTagById(state.tags));
  const tree             = useMemo(() => getTree(roots, getTagById, null, t)[0], [roots, getTagById, t]);

  const language = useSelector(state => settings.getUILang(state.settings));
  const dir      = useSelector(state => settings.getUIDir(state.settings));

  const dispatch = useDispatch();

  const create = () => {
    const { content_unit, properties, language: l = language, media_type = 'text' } = label;

    const params = {
      i18n: {
        [l]: { name, language: l }
      },
      tags: selected,
      content_unit,
      properties,
      media_type
    };

    dispatch(mdbActions.createLabel(params));
  };

  const clear = () => {
    setSelected([]);
    setName('');
    setAlertMsg(null);
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

  const handleCancel = () => {
    onClose();
    clear();
  };

  const needToLogin = NeedToLogin({ t });

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={clear} dir={dir}/>
      <Modal
        open={open}
        onClose={onClose}
        className="select_topic_modal"
        size="large"
        trigger={trigger}
        dir={dir}
      >
        <Modal.Header content={t('personal.label.header')} className="no-border"/>
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
                    <input autoFocus/>
                  </Input>
                </Modal.Content>
                <Modal.Content style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Container as="h4" className="font-normal" content={t('personal.label.infoAddTag')}/>
                  <Input
                    className="search-omnibox"
                    placeholder={t('personal.label.search')}
                    onChange={handleFilterChange}
                  />
                </Modal.Content>
                <Modal.Content scrolling className="label_topic_grid">
                  {
                    tree?.children && (
                      <Grid columns={isMobileDevice ? 1 : tree.children.length}>
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
            onClick={handleCancel}
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
  t      : PropTypes.func.isRequired,
  open   : PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default withTranslation()(SelectTopicsModal);
