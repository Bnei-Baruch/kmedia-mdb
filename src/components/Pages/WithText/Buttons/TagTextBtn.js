import React, { useState } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import SelectTopicsModal from '../../../shared/SelectTopicsModal/SelectTopicsModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector
} from '../../../../redux/selectors';

const TagTextBtn = () => {
  const { t } = useTranslation();

  const { select, search } = useSelector(textPageGetUrlInfoSelector);
  const { language }       = useSelector(textPageGetFileSelector);
  const subject            = useSelector(textPageGetSubjectSelector);

  const properties              = { ...select, ...search };
  const [urlProps, setUrlProps] = useState(properties);
  const [open, setOpen]         = useState(false);

  const handleOpen = () => {
    setUrlProps(properties);
    setOpen(true);
  };

  const handleClose = () => {
    setUrlProps(properties);
    setOpen(false);
  };

  const label = {
    language,
    content_unit: subject.id,
    properties: {
      ...subject.properties,
      ...urlProps
    }
  };
  return (
    <SelectTopicsModal
      label={label}
      open={open}
      onClose={handleClose}
      trigger={
        <Popup
          on="hover"
          content={t('page-with-text.buttons.tag')}
          trigger={
            <Button
              icon={<span className="material-symbols-outlined">tag</span>}
              onClick={handleOpen}
            />
          }
        />
      }
    />
  );
};

export default TagTextBtn;
