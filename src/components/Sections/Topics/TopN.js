import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Button } from 'semantic-ui-react';
//import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { NO_NAME } from '../../../helpers/consts';
import { sectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';
// import { selectors } from '../../../redux/modules/tags';
// import { selectors as mdbSelectors } from '../../../redux/modules/mdb';

class TopN extends React.PureComponent{
  static propTypes = {
    section: PropTypes.string.isRequired,
    N: PropTypes.number.isRequired,
    units: PropTypes.arrayOf(shapes.ContentUnit),
    t: PropTypes.func.isRequired, 
  }

  state = {
    topNUnits: []
  }

  componentDidMount(){
    this.getTopNUnits();
  }

  renderUnit(unit, t) {
    const link = canonicalLink(unit);
    let filmDate = '';
    if (unit.film_date) {
      filmDate = t('values.date', { date: new Date(unit.film_date) });
    }

    return(
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

  displayAllItems = () => {
    alert('all items');
  }

  compareUnits = (a,b) => {
    let ans = -1;
    if (a && b && a.film_date <= b.film_date){
      ans = 1;
    }
    
    return ans;
  }

  getTopNUnits = () => {
    const {units, N} = this.props;
    let topNUnits;

    if (Array.isArray(units)){
      units.sort(this.compareUnits);

      topNUnits = units.length > N ?
                  units.slice(0, N) :
                  units;
    }

    this.setState({topNUnits});
   
  }

  render(){
    const { section, t } = this.props;
    const units = this.state.topNUnits;

    return (
      Array.isArray(units) && units.length > 0 ?
      <Table fixed unstackable basic="very" >
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
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell>
              <Button primary size='small' onClick={this.displayAllItems}>View Rest</Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table> :
      null
    );
  }

}

// const mapState = (state, ownProps) => {
//   const {contentType, N} = ownProps;
//   const getUnitIdsByContentType = selectors.getUnitIdsByContentType(state.tags);
  
//   let units = [];

//   if (getUnitIdsByContentType){
//     const unitIds = getUnitIdsByContentType(contentType);
//     const topNUnitIds = Array.isArray(unitIds) ?
//                           unitIds.length > N ?
//                           unitIds.slice(0, N) :
//                           unitIds :
//                         [];

//     units = topNUnitIds.length > 0 ?
//             topNUnitIds.map(id => mdbSelectors.getDenormContentUnit(state.mdb, id)) :
//             [];
//   }

//   return { units };
  
// }

export default translate()(TopN);
//connect(mapState)(translate()(TopN));