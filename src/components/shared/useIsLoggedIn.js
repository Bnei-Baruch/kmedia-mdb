import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../redux/modules/auth';

const useIsLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const user                    = useSelector(state => selectors.getUser(state.auth));

  // We can't use user === true because of SSR.
  useEffect(() => {
    setLoggedIn(!!user);
  }, [user]);

  return loggedIn;
};

export default useIsLoggedIn;
