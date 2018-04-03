import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty } from '../../../helpers/utils';

class Profile extends Component {
  static propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  };

  static defaultProps = {
  };

  render() {
    const { firstName, lastName } = this.props;

    return (
      <Helmet>
        <meta property="og:type" content="profile" />
        {isEmpty(firstName) ? <meta property="profile:first_name" content={firstName} /> : null}
        {isEmpty(lastName) ? <meta property="profile:last_name" content={lastName} /> : null}
      </Helmet>
    );
  }
}

export default Profile;
