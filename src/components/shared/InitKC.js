import React, { useEffect } from 'react';

import * as shapes from '../shapes';
import { initKC } from '../../sagas/helpers/keycklockManager';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../redux/modules/auth';
import { selectors as settings } from '../../redux/modules/settings';
import { Splash } from './Splash/Splash';

const InitKC = ({ children }) => {
  const dispatch = useDispatch();
  const language = useSelector(state => settings.getLanguage(state.settings));
  const user     = useSelector(state => selectors.getUser(state.auth));
  useEffect(() => {
    !user && initKC(dispatch, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('InitKC duble bug render', user, user !== undefined);
  return user !== undefined ? children : <Splash isLoading icon="circle notch" color="blue" text={''} />;
};

InitKC.propTypes = {
  children: shapes.Children.isRequired
};

export default InitKC;
