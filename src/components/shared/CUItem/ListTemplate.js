import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Label, Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import { formatDuration } from '../../../helpers/utils';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';

const ListTemplate = ({ unit, language, withCCUInfo, link, ccu, description, children }) => {
  const dir = isLanguageRtl(language) ? 'rtl' : 'ltr';

  const ccu_info = ccu && withCCUInfo ? (
    <div className="cu_item_info_co">
      <span style={{ display: 'inline-block' }}>
        <UnitLogo collectionId={ccu.id} />
      </span>
      <Header size="small" content={ccu.name || NO_NAME} textAlign="left" />
    </div>) : null;

  return (
    <Table.Row className="cu_item cu_item_list no-thumbnail" verticalAlign="top" key={unit.id}>
      <Table.Cell width={2} className={'no-padding'} verticalAlign={'top'} collapsing singleLine>
        <Link to={link} className="cu_item_img">
          <UnitLogo unitId={unit.id} width={287} />
          <Container className="cu_item_img_info" textAlign="right">
            <Label className="cu_item_duration" content={formatDuration(unit.duration)} />
          </Container>
        </Link>
      </Table.Cell>
      <Table.Cell verticalAlign={'top'} className={'cu_item_info'}>
        {ccu_info}
        <div className="cu_item_name">
          {unit.name}
        </div>
        <div className={`cu_info_description ${dir}`}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </Table.Cell>
      <Table.Cell width={1} verticalAlign="middle">
        {children}
      </Table.Cell>
    </Table.Row>
  );
};

ListTemplate.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  language: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  withCCUInfo: PropTypes.bool,
  ccu: shapes.Collection,
  description: PropTypes.array,
  position: PropTypes.number
};

export default ListTemplate;
