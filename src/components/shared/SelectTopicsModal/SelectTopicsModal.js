import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  settingsGetUIDirSelector,
  settingsGetUILangSelector,
  tagsGetDisplayRootsSelector,
  tagsGetTagByIdSelector
} from '../../../redux/selectors';

const SelectTopicsModal = ({open, onClose, label, trigger}) => {
  const {t} = useTranslation();

  const [selected, setSelected] = useState([]);
  const [match, setMatch] = useState('');
  const [name, setName] = useState('');
  const [alertMsg, setAlertMsg] = useState();

  const {isMobileDevice} = useContext(DeviceInfoContext);

  const roots = useSelector(tagsGetDisplayRootsSelector, isEqual) || [];
  const getTagById = useSelector(tagsGetTagByIdSelector);
  const tree = useMemo(() => getTree(roots, getTagById, null, match, t)[0], [roots, getTagById, match, t]);

  const language = useSelector(settingsGetUILangSelector);
  const dir = useSelector(settingsGetUIDirSelector);

  const dispatch = useDispatch();

  const create = () => {
    const {content_unit, properties, language: l = language, media_type = 'text'} = label;

    const params = {
      i18n: {
        [l]: {name, language: l}
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
      <Container className="padded">
        {
          col.children?.filter(ch => ch.matched).map(ch => (
            <Grid.Column key={ch.value} className="topics_card">
              <Header as="h3" className="topics_title">
                {ch.text}
              </Header>
              <TopicBranch
                leafs={ch.children}
                selected={selected}
                setSelected={handleSetSelected}
              />
            </Grid.Column>
          ))
        }
      </Container>
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

  const handleSetSelected = useCallback((sel) => setSelected(sel), []);

  const needToLogin = NeedToLogin({t});

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
                <Modal.Content style={{paddingTop: 0}}>
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
                <Modal.Content style={{paddingTop: 0, paddingBottom: 0}}>
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
                            tree.children.map(renderColumn)
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

export default SelectTopicsModal;
