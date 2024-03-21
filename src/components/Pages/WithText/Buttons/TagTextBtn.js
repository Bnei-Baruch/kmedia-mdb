import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import SelectTopicsModal from '../../../shared/SelectTopicsModal/SelectTopicsModal';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import Tagging from '../../../../images/icons/Tagging';

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
      language,
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
          className="text_mark_on_select_btn no_fill"
          icon={<Tagging />}
          onClick={handleOpen}
        />
      }
    />
  );
};

export default TagTextBtn;
