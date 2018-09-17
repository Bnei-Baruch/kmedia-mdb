import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Image, Table } from 'semantic-ui-react';

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
    tagPath: PropTypes.arrayOf(PropTypes.object).isRequired,
    units: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    topNUnits: []
  };

  componentDidMount() {
    this.getTopNUnits(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.units !== nextProps.units ||
      this.props.N !== nextProps.N) {
      this.getTopNUnits(nextProps);
    }
  }

  getTopNUnits = (props) => {
    const { units, N } = props;
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

    return `/${section}?${urlSearchStringify(query)}`;
  };

  compareUnits = (a, b) => {
    let ans = -1;
    if (a && b && a.film_date <= b.film_date) {
      ans = 1;
    }

    return ans;
  };

  renderUnit = (unit, t) => {
    const link   = canonicalLink(unit);
    let filmDate = '';
    if (unit.film_date) {
      filmDate = t('values.date', { date: new Date(unit.film_date) });
    }

    return (
      <Table.Row key={unit.id} verticalAlign="top">
        <Table.Cell>
          <span className="index__date">{filmDate}</span>
          {/* eslint-disable-next-line */}
          <Link className="index__title" to={link}>
            {unit.name || NO_NAME}
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { section, t } = this.props;
    const { topNUnits }  = this.state;
    const url            = this.getTopicUrl();

    return (
      Array.isArray(topNUnits) && topNUnits.length > 0 ?
        <Table unstackable basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Header as="h3">
                  <Image src={sectionLogo[section]} /> {t(`nav.sidebar.${section}`)}
                </Header>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topNUnits.map(x => this.renderUnit(x, t))}
          </Table.Body>
          {!url.includes('events') ? // exclude button to events - page not exists
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell>
                  <Button primary size="tiny" href={url}>View All</Button>
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

export default TopN;
