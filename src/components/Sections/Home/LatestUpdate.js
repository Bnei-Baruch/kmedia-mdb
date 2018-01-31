import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label, Card } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';


class LatestUpdate extends Component {

  static propTypes = {
    img: PropTypes.string.isRequired,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string
  };

  static defaultProps = {};

  render() {

    const { img, title, subTitle, label, href } = this.props;

    return (
      <Card as={Link} to={href}>
        <Image src={img} />
        <Card.Content>
          <Header size='small'>
            <small className='text grey'>{subTitle}</small>
            <br />
            {title}
          </Header>
        </Card.Content>
        <Card.Content extra>
          <Label size='small'>{label}</Label>
        </Card.Content>
      </Card>
    );
  }
}

export default LatestUpdate;
