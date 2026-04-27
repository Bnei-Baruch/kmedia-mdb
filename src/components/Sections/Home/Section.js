import PropTypes from 'prop-types';
import React from 'react';
import * as shapes from '../../shapes';

const Section = ({ title, children, className }) =>
  <div className={className}>
    <div className="homepage__section__iconsrow flex flex-col items-center">
      <div className="iconsTitleRow flex justify-center w-full">
        <div className="iconsTitle">{title}</div>
      </div>
      <div className="w-full py-4">
        {children}
      </div>
    </div>
  </div>;

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: shapes.Children.isRequired,
  className: PropTypes.string,
  computer: PropTypes.number,
};

export default Section;
