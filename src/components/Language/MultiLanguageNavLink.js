import { NavLink } from 'react-router-dom';
import multiLanguageLinkCreator from './MultiLanguageLinkCreator';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

export default multiLanguageLinkCreator()(NavLink);
