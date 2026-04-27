import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
const Icon = ({ icon, className, ...props }) => <FontAwesomeIcon icon={icon} className={className} {...props} />;

export default Icon;
