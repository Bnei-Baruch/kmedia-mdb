/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon } from 'semantic-ui-react';

export const Splash = (props) => {
  const { text, subtext, icon, color, isLoading } = props;

  return (
    <Header icon className="splash" as="h2" textAlign="center">
      <Icon name={icon} loading={isLoading} color={color} />
      <Header.Content>
        {text}
        {subtext ? <Header.Subheader>{subtext}</Header.Subheader> : null}
      </Header.Content>
    </Header>
  );
};

Splash.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  subtext: PropTypes.node,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
};

Splash.defaultProps = {
  subtext: null,
  color: 'black',
  isLoading: false,
};

export const LoadingSplash = props => (<Splash isLoading icon="spinner" {...props} />);
export const FrownSplash   = props => (<Splash icon="frown" color="orange" {...props} />);
export const ErrorSplash   = props => (<Splash icon="warning sign" color="red" {...props} />);
