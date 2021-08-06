import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon } from 'semantic-ui-react';

export const Splash = props => {
  const { text, subtext = null, icon, color = 'black', isLoading = false, item = null } = props;

  return (
    <div className="splash">
      <Header icon as="h2" textAlign="center">
        <Icon name={icon} loading={isLoading} color={color} />
        <Header.Content>
          {text}
          {subtext ? <Header.Subheader data-testid='header.subHeader'>{subtext}</Header.Subheader> : null}
          {item ? <Header.Subheader>{item}</Header.Subheader> : null}
        </Header.Content>
      </Header>
    </div>
  );
};

Splash.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  subtext: PropTypes.node,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  item: PropTypes.func,
};

export const LoadingSplash = props => (<Splash isLoading icon="circle notch" color="blue" {...props} />);
export const FrownSplash   = props => (<Splash icon="frown" color="orange" {...props} />);
export const ErrorSplash   = props => (<Splash icon="warning sign" color="red" {...props} />);
