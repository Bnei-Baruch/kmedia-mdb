import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authGetUserSelector } from '../../redux/selectors';

const useIsLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const user                    = useSelector(authGetUserSelector);

  // We can't use user === true because of SSR.
  useEffect(() => {
    setLoggedIn(!!user);
  }, [user]);

  return loggedIn;
};

export default useIsLoggedIn;
