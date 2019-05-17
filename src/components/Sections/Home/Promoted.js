import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Header, Image } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import img from '../../../images/hp_featured_temp.jpg';
// import img from '../../../images/banner_downloads.jpg';
// import img from '../../../images/virtual_congress.jpg';
// import img from '../../../images/pesach.jpg';
// import img from '../../../images/rosh_shana.jpg';
// import img from '../../../images/KKLO_ITALY_18_logo2.svg';
// import img from '../../../images/archive_banner.jpg';

class Promoted extends Component {
  static propTypes = {
    // banner: shapes.Banner,
    t: PropTypes.func.isRequired,
  };

  // static defaultProps = {
  //   banner: null,
  // };

  render() {
    const { t } = this.props;

    const header    = t('home.promoted.header');
    const subHeader = t('home.promoted.subheader');

    return (
      <div className="thumbnail">
        <Link to="/events/c/iCiUABK4">
          <Image fluid src={img} className="thumbnail__image" />
          {
            header
              ? (
                <Header as="h2" className="thumbnail__header">
                  <Header.Content>
                    <Header.Subheader>
                      {subHeader}
                    </Header.Subheader>
                    {header}
                  </Header.Content>
                </Header>
              )
              : null
          }
        </Link>
      </div>
    );
  }
}

export default withNamespaces()(Promoted);
