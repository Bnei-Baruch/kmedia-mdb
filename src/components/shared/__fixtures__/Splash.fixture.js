import { Splash } from '../Splash';

// Like ErrorSplash
export default {
  component: Splash,
  props: {
    icon: 'warning sign',
    color: 'red',
    text: 'Server Error',
    subtext: 'No response from server',
    isLoading: false
  }
};
