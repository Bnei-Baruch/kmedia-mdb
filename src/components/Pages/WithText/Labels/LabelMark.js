import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { SectionLogo } from '../../../../helpers/images';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { makeTagLinks } from '../../WithPlayer/widgets/Info/Info';
import { useSelector } from 'react-redux';
import { selectors as tagsSelectors } from '../../../../redux/modules/tags';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { highlightByPrefixAndId, clearHighlightByStyle } from '../helper';

const idPrefix  = textMarksPrefixByType['label'];
const LabelMark = ({ label, offset }) => {
  const { t } = useTranslation();

  const [top, setTop]       = useState(0);
  const [bottom, setBottom] = useState(0);

  const getTagById = useSelector(state => tagsSelectors.getTagById(state.tags));

  const { language, author, name, id, tags = [] } = label;
  useEffect(() => {
    const findTopBot = () => {
      let start = document.getElementById(`${idPrefix.start}${id}`);
      let end   = document.getElementById(`${idPrefix.end}${id}`);
      start     = start || end || null;
      end       = end || start || null;
      if (start) {
        const b = start.offsetTop !== end.offsetTop ? end.offsetTop : end.offsetTop + 20;
        setTop(Math.min(start.offsetTop, b));
        setBottom(Math.max(start.offsetTop, b));
      }
    };

    //need to wait till parent DOM will render for find element
    setTimeout(findTopBot, 0);
  }, [id]);

  if (!top || !bottom)
    return null;

  const dir = getLanguageDirection(language);

  const tagLinks = makeTagLinks(tags, getTagById);

  const handleOpen = () => highlightByPrefixAndId(idPrefix, id);

  return (
    <div className="label_mark" style={{ top, height: bottom - top + 20, left: `${offset.x * 5}px` }}>
      <Popup
        trigger={
          <Button basic className="clear_button" style={{ marginTop: `${offset.y * 20}px` }}>
            <SectionLogo name="topics" width="25" height="25" />
          </Button>
        }
        inverted
        onOpen={handleOpen}
        onClose={() => clearHighlightByStyle()}
        on="click"
        position={`right center`}
        className="label_mark_popup"
        dir={dir}
      >
        <Popup.Header>{name}</Popup.Header>
        <Popup.Content>
          {
            t('personal.label.createdBy', { author })
          }
          <div>{tagLinks}</div>
        </Popup.Content>
      </Popup>
    </div>

  );
};

export default LabelMark;
