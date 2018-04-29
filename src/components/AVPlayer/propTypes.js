import PropTypes from 'prop-types';
import { PLAYER_MODE } from './constants';

export const playerModeProp = PropTypes.oneOf(Object.values(PLAYER_MODE));
