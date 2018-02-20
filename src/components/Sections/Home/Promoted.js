import React, { Component } from 'react';
import { Header, Image, Label } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import img from '../../../images/archive_banner.jpg';

class Promoted extends Component {
  static propTypes = {
    banner: shapes.Banner,
  };

  static defaultProps = {
    banner: null,
  };

  render() {
    if (!this.props.banner) {
      return null;
    }

    const { header, sub_header: subHeader, section, url } = this.props.banner;

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
              <Label content="DONATE NOW" color="orange" />
          }
        </a>
      </div>
    );
  }
}

export default Promoted;
