import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

class Featured extends Component {

  static propTypes = {
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string
  };

  static defaultProps = {};

  render() {

    const { thumbnail, title, subTitle, label, href } = this.props;

    return (
      <div className='thumbnail'>
        <Link to={href}>
          <UnitLogo width={150} />
          {/*<Image className='thumbnail__image' src={thumbnail} fluid />*/}
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

export default Featured;
