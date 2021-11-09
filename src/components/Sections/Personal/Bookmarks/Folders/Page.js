import React, { useCallback, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';

const Page = ({ location, t }) => null;

export default withNamespaces()(withRouter(Page));
