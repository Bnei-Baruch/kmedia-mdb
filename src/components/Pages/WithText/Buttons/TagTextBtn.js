import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import SelectTopicsModal from '../../../shared/SelectTopicsModal/SelectTopicsModal';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const TagTextBtn = () => {
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
        <ToolbarBtnTooltip
          textKey="add-tag"
          icon={<span className="material-symbols-outlined">tag</span>}
          onClick={handleOpen}
        />
      }
    />
  );
};

export default TagTextBtn;
