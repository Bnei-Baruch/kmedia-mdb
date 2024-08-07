import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import produce from 'immer';
import { Button, Header, Table, Image } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import { isNotEmptyArray, strCmp } from '../../../helpers/utils';
import * as renderUnitHelper from '../../../helpers/renderUnitHelper';
import * as shapes from '../../shapes';

const TopN = ({ units, N, sectionCount, section, topicUrl, t }) => {
  const [topNUnits, setTopNUnits]         = useState([]);
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    const topNUnits = getTopNUnits(units, N);
    setTopNUnits(topNUnits);

    const buttonViewAllVisible = isButtonViewAllVisible(sectionCount, N, topicUrl);
    setButtonVisible(buttonViewAllVisible);
  }, [units, sectionCount, N, topicUrl]);

  return (isNotEmptyArray(topNUnits)
    ? renderTable(topNUnits, section, buttonVisible ? topicUrl : null, t)
    : null);
};

const isButtonViewAllVisible = (totalUnits, N, url) => (
  // don't show button to events - page not exists
  // show only for more than N units
  totalUnits > N && !url.includes('events')
);

const getTopNUnits = (units, N) => {
  const validUnits = units.filter(u => !!u);

  const topNUnits = produce(validUnits, draft => {
    if (isNotEmptyArray(draft)) {
      draft.sort(compareUnits);
    }
  });

  return topNUnits.length > N
    ? topNUnits.slice(0, N)
    : topNUnits;
};

const compareUnits = (u1, u2) => strCmp(u2.film_date, u1.film_date);

const renderTable = (topNUnits, section, url, t) => (
  <Table unstackable basic="very">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>
          <Header icon as="h3">
            <Image size="big" verticalAlign="middle">
              <SectionLogo name={section} />
            </Image>
            {t(`nav.sidebar.${section}`)}
          </Header>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {topNUnits.map(x => renderUnit(x, t))}
    </Table.Body>
    {
      url
        ? (
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell>
                <Button primary size="tiny" href={url}>{t('buttons.view-all')}</Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )
        : null
    }
  </Table>
);

const renderUnit = (unit, t) =>
  (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell>
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
        { renderUnitHelper.renderUnitNameLink(unit)}
      </Table.Cell>
    </Table.Row>
  );

TopN.propTypes = {
  section: PropTypes.string.isRequired,
  units: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
  N: PropTypes.number.isRequired,
  sectionCount: PropTypes.number.isRequired,
  topicUrl: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(TopN);
