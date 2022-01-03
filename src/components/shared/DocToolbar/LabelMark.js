import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { SectionLogo } from '../../../helpers/images';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { left } from 'core-js/internals/array-reduce';

const LabelMark = ({ label, offset, t }) => {
  const [top, setTop]       = useState(0);
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    let start = document.getElementById(`start_${label.uid}`);
    let end   = document.getElementById(`end_${label.uid}`);
    start     = start || end || null;
    end       = end || start || null;
    if (start) {
      const b = start.offsetTop !== end.offsetTop ? end.offsetTop : end.offsetTop + 20;
      setTop(Math.min(start.offsetTop, b));
      setBottom(Math.max(start.offsetTop, b));
    }
  }, []);

  if (!top || !bottom)
    return null;

  const dir = getLanguageDirection(label.language);

  return (
    <div className="label_mark" style={{ top, height: bottom - top + 20, left: `${offset.x * 5}px` }}>
      <Popup
        trigger={
          <Button basic className="clear_button" style={{ marginTop: `${offset.y * 20}px` }}>
            <SectionLogo name="topics" width="25" height="25" />
          </Button>
        }
        inverted
        on="click"
        position={`${dir === 'rtl' ? 'right' : 'left'} center`}
        className="label_mark_popup"
        dir={dir}
      >
        <Popup.Header>{label.name}</Popup.Header>
        <Popup.Content>{t('personal.label.createdBy', { author: label.author })}</Popup.Content>
      </Popup>
    </div>

  );
};

LabelMark.propTypes = {
  t: PropTypes.func.isRequired,
  offset: PropTypes.object,
  label: PropTypes.object,
};

export default withNamespaces()(LabelMark);
