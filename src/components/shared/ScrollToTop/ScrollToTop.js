import { Component } from 'react';
import { withRouter } from 'react-router';

import * as shapes from '../../shapes';

class ScrollToTop extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
  };

  // componentDidUpdate has a rather strict purpose
  // see these links before putting more logic here
  // https://reactjs.org/docs/react-component.html#componentdidupdate
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/postrender_with_componentdidupdate.html
  componentDidUpdate(prevProps) {
    if (window.pageYOffset && this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
