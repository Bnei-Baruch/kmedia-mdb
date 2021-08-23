import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card, Header, Label, Grid, Popup } from 'semantic-ui-react';

import { CT_CLIPS, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, NO_NAME } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import { canonicalCollection, formatDuration, imageByUnit } from '../../helpers/utils';
import UnitLogo from '../shared/Logo/UnitLogo';
import { selectors, actions } from '../../redux/modules/mdb';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { selectors as settings } from '../../redux/modules/settings';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];
const CUItem                  = ({ id, children, t }) => {
  const unit     = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const views    = 5000;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!unit) {
      dispatch(actions.fetchUnit(id));
    }
  }, [id]);

  if (!unit) return null;
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);
  const ccu              = canonicalCollection(unit);
  const part             = ccu?.ccuNames[unit.id];
  let withCCUInfo        = false;
  for (const i in unit.collections) {
    if (NOT_LESSONS_COLLECTIONS.includes(unit.collections[i].content_type))
      withCCUInfo = true;
  }

  const description = [];
  if (part && withCCUInfo) description.push(t('pages.unit.info.episode', { name: part }));
  if (unit.film_date) description.push(t('values.date', { date: unit.film_date }));
  if (views) description.push(t('pages.unit.info.views', { views }));
  const dir = isLanguageRtl(language) ? 'rtl' : 'ltr';

  const coInfo = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <div style={{ width: '4em' }} />
      <div style={{ margin: '0 -1.5em' }}>
        <UnitLogo
          collectionId={ccu.id}
          width={130}
          circular
          fallbackImg={'https://kabbalahmedia.info/assets/logos/collections/zf4lLwyI.jpg'}
        />
      </div>
      <Popup
        trigger={<Header size="small" content={ccu.name || NO_NAME} textAlign="left" />}
        content={ccu.name}
        basic
      />
    </div>
  ) : null;

  return (
    <Card raised className="cu_item" link href={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={unit.id} fallbackImg={'https://kabbalahmedia.info/imaginary/thumbnail?url=http%3A%2F%2Flocalhost%2Fassets%2Fapi%2Fthumbnail%2FEvPTLpdf&width=520&stripmeta=true'} />
        <Container className="cu_item_info" textAlign="right">
          <Label className="cu_item_duration" content={formatDuration(unit.duration)} />
          {coInfo}
        </Container>
      </div>
      <Card.Content>
        <Card.Description content={unit.name} />
      </Card.Content>
      <Card.Meta
        className={`cu_info_description ${dir}`}
        content={description.map(d => (<span>{d}</span>))}
      />
      {children ? <Card.Content extra>{children}</Card.Content> : null}
    </Card>
  );
};

CUItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withNamespaces()(CUItem);
