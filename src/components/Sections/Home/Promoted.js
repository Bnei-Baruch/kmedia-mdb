import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import img from '../../../images/rosh_shana.jpg';
// import img from '../../../images/KKLO_ITALY_18_logo2.svg';

// import img from '../../../images/archive_banner.jpg';

class Promoted extends Component {
  static propTypes = {
    banner: shapes.Banner,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    banner: null,
  };

  render() {
    // if (!this.props.banner) {
    //   return null;
    // }

    const { t } = this.props;

    // const { header, sub_header: subHeader, section, url } = banner;

    const header    = t('home.promoted.header');
    const subHeader = t('home.promoted.subheader');
    const section   = t('events.header.text');

    return (
      <div className="thumbnail">
        <a
          href="https://docs.google.com/document/d/1cdk8Bw1-L6D5lNsAknQzXgzJ-uDsywBEPTvO9Ttsmk4/edit#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image fluid src={img} className="thumbnail__image" />
          {
            header ?
              <Header as="h2" className="thumbnail__header">
                <Header.Content>
                  <Header.Subheader>
                    {subHeader}
                  </Header.Subheader>
                  {header}
                </Header.Content>
              </Header> :
              null
          }
          {/* {
            section ?
              <Label content={section} color="black" size="tiny"/> :
              <Label content={t('home.donate')} color="black" size="tiny"/>
          } */}
        </a>
      </div>
    );
  }
}

export default Promoted;
