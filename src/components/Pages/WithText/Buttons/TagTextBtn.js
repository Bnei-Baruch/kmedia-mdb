import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, Popup } from 'semantic-ui-react';
import SelectTopicsModal from '../../../shared/SelectTopicsModal/SelectTopicsModal';
import { SectionLogo } from '../../../../helpers/images';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../redux/modules/textPage';

const TagTextBtn = () => {
  const { t } = useTranslation();

  const { select: properties } = useSelector(state => textPage.getUrlInfo(state.textPage));
  const { language }           = useSelector(state => textPage.getFile(state.textPage));
  const subject                = useSelector(state => textPage.getSubject(state.textPage));

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
          content={t('share-text.tag-button-alt')}
          trigger={
            <MenuItem>
              <Button
                icon={<span className="material-symbols-outlined">tag</span>}
                onClick={handleOpen}
              />
              {/*{t('share-text.tag-button')}*/}
            </MenuItem>
          }
        />
      }
    />
  );
};

export default TagTextBtn;
