import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { SectionLogo } from '../../../helpers/images';

const LabelMark = ({ label, offset, t }) => {
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    let start = document.getElementById(`start_${label.uid}`);
    let end = document.getElementById(`end_${label.uid}`);
    start = start || end || null
    end = end || start || null
    if (start) {
      const b = start.offsetTop !== end.offsetTop ? end.offsetTop : end.offsetTop + 20
      setTop(Math.min(start.offsetTop, b))
      setBottom(Math.max(start.offsetTop, b))
    }
  }, [])

  if (!top || !bottom)
    return null

  return (
    <div className="label_mark" style={{ top, height: bottom - top + 20, left: `${offset.x * 5  }px` }}>
      <Popup
        trigger={
          <Button basic className="clear_button" style={{ marginTop: `${offset.y * 20  }px` }}>
            <SectionLogo name="topics" width='25' height='25'/>
          </Button>
        }
        inverted
        on='click'
        position='left center'
        className="label_mark_popup"
      >
        <Popup.Header>{label.name}</Popup.Header>
        <Popup.Content>{t('personal.label.createdBy', { author: label.author })}</Popup.Content>
      </Popup>
    </div>

  );
};

LabelMark.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  source: PropTypes.object,
};

export default withNamespaces()(LabelMark);
