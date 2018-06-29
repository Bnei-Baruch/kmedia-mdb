import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Button } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import { NO_NAME } from '../../../helpers/consts';
import { sectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { stringify as urlSearchStringify } from '../../../helpers/url';
import { filtersTransformer } from '../../../filters/index';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

class TopN extends React.PureComponent {
  static propTypes = {
    section: PropTypes.string.isRequired,
    N: PropTypes.number.isRequired,
    tagId: PropTypes.string.isRequired,
    tagPath: PropTypes.arrayOf(PropTypes.object).isRequired,
    units: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    topNUnits: []
  };

  componentDidMount() {
    this.getTopNUnits();
  }

  renderUnit(unit, t) {
    const link   = canonicalLink(unit);
    let filmDate = '';
    if (unit.film_date) {
      filmDate = t('values.date', { date: new Date(unit.film_date) });
    }

    return (
      <Table.Row key={unit.id} verticalAlign="top">
        <Table.Cell>
          <span className="index__date">{filmDate}</span>
          <Link className="index__title" to={link}>
            {unit.name || NO_NAME}
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  }

  compareUnits = (a, b) => {
    let ans = -1;
    if (a && b && a.film_date <= b.film_date) {
      ans = 1;
    }

    return ans;
  };

  getTopNUnits = () => {
    const { units, N } = this.props;
    let topNUnits;

    if (Array.isArray(units)) {
      units.sort(this.compareUnits);

      topNUnits = units.length > N ?
        units.slice(0, N) :
        units;
    }

    this.setState({ topNUnits });
  };

  getTopicUrl = () => {
    const { section, tagPath } = this.props;

    const query = filtersTransformer.toQueryParams([
      { name: 'topics-filter', values: [tagPath.map(y => y.id)] }
    ]);

    const search = urlSearchStringify(query);
    const url    = `/${section}?${search}`;

    return url;
  };

  render() {
    const { section, t }       = this.props;
    const { topNUnits: units } = this.state;
    const url                  = this.getTopicUrl();

    return (
      Array.isArray(units) && units.length > 0 ?
        <Table unstackable basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Image src={sectionLogo[section]} />
                <span>{t(`nav.sidebar.${section}`)}</span>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {units.map(x => this.renderUnit(x, t))}
          </Table.Body>
          { !url.includes('events') ? // exclude button to events - page not exists
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell>
                  <Button primary size="medium" href={url}>View All</Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer> :
            null
          }
        </Table> :
        null
    );
  }
}

export default translate()(TopN);
