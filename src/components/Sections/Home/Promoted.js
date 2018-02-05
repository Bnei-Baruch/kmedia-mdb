import React, { Component } from 'react';
import { Header, Image, Label } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

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

    const { image, header, sub_header: subHeader, section, href } = this.props.banner;

    return (
      <div className="thumbnail">
        <Link to={href}>
          <Image fluid src={image} className="thumbnail__image" />
          <Header as="h2" className="thumbnail__header">
            <Header.Content>
              <Header.Subheader>
                {subHeader}
              </Header.Subheader>
              {header}
            </Header.Content>
          </Header>
          <Label content={section} color="orange" size="mini" />
        </Link>
      </div>
    );
  }
}

export default Promoted;
