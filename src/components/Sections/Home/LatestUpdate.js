import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Label, Card } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import * as shapes from '../../shapes';
import { canonicalLink } from '../../../helpers/utils';


class LatestUpdate extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {};

  render() {

    const { unit, label } = this.props;

    return (
      <Card as={Link} to={canonicalLink(unit)}>
        <UnitLogo width={512} unitId={unit.id} />
        <Card.Content>
          <Header size='small'>
            <small className='text grey'>{unit.file_date}</small>
            <br />
            {unit.name}
          </Header>
        </Card.Content>
        <Card.Content extra>
          <Label size='small'>{label}</Label>
        </Card.Content>
      </Card>
    );
  }
}

export default LatestUpdate;
