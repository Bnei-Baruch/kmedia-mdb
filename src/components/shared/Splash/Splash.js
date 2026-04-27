import React from 'react';
import PropTypes from 'prop-types';

const iconNameMap = {
  'circle notch': 'progress_activity',
  'frown': 'sentiment_dissatisfied',
  'warning sign': 'warning',
};

const colorClassMap = {
  black: 'text-black',
  blue: 'text-blue-500',
  orange: 'text-orange-500',
  red: 'text-red-500',
};

export const Splash = props => {
  const { text, subtext = null, icon, color = 'black', isLoading = false, item = null } = props;
  const mappedIcon = iconNameMap[icon] || icon;
  const colorClass = colorClassMap[color] || 'text-black';

  return (
    <div className="splash">
      <h2 className="text-center">
        <span className={`material-symbols-outlined ${colorClass} ${isLoading ? 'animate-spin' : ''}`}>
          {mappedIcon}
        </span>
        <div>
          {text}
          {subtext ? <div className="small text-gray-500" data-testid="header.subHeader">{subtext}</div> : null}
          {item ? <div className="small text-gray-500">{item}</div> : null}
        </div>
      </h2>
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

export const LoadingSplash = props => (<Splash isLoading icon="progress_activity" color="blue" {...props} />);
export const FrownSplash   = props => (<Splash icon="sentiment_dissatisfied" color="orange" {...props} />);
export const ErrorSplash   = props => (<Splash icon="warning" color="red" {...props} />);
