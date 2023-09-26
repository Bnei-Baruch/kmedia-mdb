import React from 'react';
import { Link } from 'next/link';

/**
 * Use this component instead of react-router-dom's Link to keep the current language in the destination route
 */
export const LangLink = (props) => {
  return <Link {...props} locale />;
};
//export default multiLanguageLinkCreator()(Link);
export default Link;
