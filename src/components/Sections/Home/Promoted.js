import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import img from '../../../images/archive_banner.jpg';

class Promoted extends Component {
  static propTypes = {
    banner: shapes.Banner,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    banner: null,
  };

  render() {
    if (!this.props.banner) {
      return null;
    }

    const { banner, t } = this.props;

    const { header, sub_header: subHeader, section, url } = banner;

    return (
      <div className="thumbnail">
        <a href={url}>
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
          {
            section ?
              <Label content={section} color="orange" /> :
              <Label content={t('home.donate')} color="orange" />
          }
        </a>
      </div>
    );
  }
}

export default Promoted;
