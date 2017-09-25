import React from 'react';
import moment from 'moment';
import { Grid, Header, Image } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import * as shapes from '../../shapes';
import placeholder from './placeholder.png';

const PageHeader = (props) => {
  const { name, description, start_date, end_date, country, city, full_address: fullAddress } = props.item;

  let addressLine = fullAddress;
  if (!addressLine) {
    if (city) {
      addressLine = `${city},${country}`;
    } else {
      addressLine = country;
    }
  }

  return (
    <Grid.Row>
      <Grid.Column width={3}>
        <Image fluid shape="rounded" src={placeholder} />
      </Grid.Column>
      <Grid.Column width={8}>
        <Header as="h1">
          <Header.Content>
            <small className="text grey">
              {fromToLocalized(moment.utc(start_date, DATE_FORMAT), moment.utc(end_date, DATE_FORMAT))}
            </small>
            <br />
            {name}
            <Header.Subheader style={{direction: 'ltr'}}>
              {addressLine}
            </Header.Subheader>
          </Header.Content>
        </Header>
        {
          description ?
            <p>{description}</p> :
            null
        }
      </Grid.Column>
    </Grid.Row>
  );
};

PageHeader.propTypes = {
  item: shapes.EventCollection.isRequired,
};

export default PageHeader;
