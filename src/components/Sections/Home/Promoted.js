import React, { Component } from 'react';
import { Header, Image, Label } from 'semantic-ui-react';

import * as shapes from '../../shapes';

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
          <Image fluid src={'/static/media/hp_featured_temp.cca39640.jpg'} className="thumbnail__image" />
          <Header as="h2" className="thumbnail__header">
            <Header.Content>
              <Header.Subheader>
                {subHeader}
              </Header.Subheader>
              {header}
            </Header.Content>
          </Header>
          <Label content={section} color="orange" size="mini" />
        </a>
      </div>
    );
  }
}

export default Promoted;
