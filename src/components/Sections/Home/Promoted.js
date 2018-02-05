import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';

class Promoted extends Component {

  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string
  };

  static defaultProps = {};

  render() {

    const { image, title, subTitle, label, href } = this.props;

    return (
      <div className='thumbnail'>
        <Link to={href}>
          <Image className='thumbnail__image' src={image} fluid />
          <Header className='thumbnail__header'>
            <Header.Content>
              <Header.Subheader>
                {subTitle}
              </Header.Subheader>
              {title}
            </Header.Content>
          </Header>
          <Label color='orange' size='mini'>
            {label}
          </Label>
        </Link>
      </div>
    );
  }
}

export default Promoted;
