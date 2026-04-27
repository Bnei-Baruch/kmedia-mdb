import React, { useMemo, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  settingsGetUIDirSelector,
  settingsGetUILangSelector,
  tagsGetDisplayRootsSelector,
  tagsGetTagByIdSelector
} from '../../../redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogPanel } from '@headlessui/react';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getTree } from '../../../helpers/topicTree';
import { actions } from '../../../redux/modules/mdb';
import AlertModal from '../AlertModal';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import TopicBranch from './TopicBranch';

const SelectTopicsModal = ({ open, onClose, label, trigger }) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState([]);
  const [match, setMatch]       = useState('');
  const [name, setName]         = useState('');
  const [alertMsg, setAlertMsg] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const roots      = useSelector(tagsGetDisplayRootsSelector);
  const getTagById = useSelector(tagsGetTagByIdSelector);
  const tree       = useMemo(() => getTree(roots, getTagById, null, match, t)[0], [roots, getTagById, match, t]);

  const language = useSelector(settingsGetUILangSelector);
  const dir      = useSelector(settingsGetUIDirSelector);

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

    dispatch(actions.createLabel(params));
  };

  const clear = () => {
    setSelected([]);
    setName('');
    setAlertMsg(null);
  };

  const renderColumn = col => (
    <div key={col.value}>
      <h2 className="topic_row_title topics__title">{col.text}</h2>
      <div className=" px-4 ">
        {
          col.children?.filter(ch => ch.matched).map(ch => (
            <div key={ch.value} className="topics_card">
              <h3 className="topics_title">{ch.text}</h3>
              <TopicBranch
                leafs={ch.children}
                selected={selected}
                setSelected={handleSetSelected}
              />
            </div>
          ))
        }
      </div>
    </div>
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

  const handleSetSelected = useCallback(sel => setSelected(sel), []);

  const needToLogin = NeedToLogin({ t });

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={clear} dir={dir} />
      {trigger}
      <Dialog open={!!open} onClose={onClose} className="relative z-50 select_topic_modal" dir={dir}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b font-bold large no-border">
              {t('personal.label.header')}
            </div>
            {
              needToLogin ?
                (
                  <div className="p-6">{needToLogin}</div>
                ) : (
                  <>
                    <div className="px-6 py-4 pt-0">
                      <div className={`label_name flex w-full items-center ${selected.length > 0 && !name ? 'border-red-500' : ''}`}>
                        <span className="inline-flex items-center px-3 py-2 small no-border">
                          {t('personal.label.name')}
                        </span>
                        <input
                          defaultValue={name}
                          onChange={e => handleSetName(e, { value: e.target.value })}
                          className="flex-1 border border-gray-300 rounded px-3 py-2"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="px-6 pb-0 pt-0">
                      <h4 className="font-normal">{t('personal.label.infoAddTag')}</h4>
                      <input
                        className="search-omnibox border border-gray-300 rounded px-3 py-2 w-full"
                        placeholder={t('personal.label.search')}
                        onChange={e => handleFilterChange(e, { value: e.target.value })}
                      />
                    </div>
                    <div className="label_topic_grid px-6 py-4 overflow-y-auto flex-1">
                      {
                        tree?.children && (
                          <div
                            className="grid gap-4"
                            style={{ gridTemplateColumns: `repeat(${isMobileDevice ? 1 : tree.children.length}, 1fr)` }}
                          >
                            {
                              tree.children.map(renderColumn)
                            }
                          </div>
                        )
                      }
                    </div>
                  </>
                )
            }
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
                onClick={handleCancel}
              >
                {t('buttons.cancel')}
              </button>
              <button
                className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 disabled:opacity-50"
                onClick={handleSave}
                disabled={!selected.length || !name}
              >
                {t('personal.label.tagging')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default SelectTopicsModal;
