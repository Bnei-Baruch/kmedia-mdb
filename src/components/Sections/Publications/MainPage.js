import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/publications';
import { actions as filterActions } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import Articles from './tabs/Articles/List';
import Blog from './tabs/Blog/Container';
import Twitter from './tabs/Twitter/Container';

export const tabs = [
  'blog',
  'twitter',
  'articles',
];

class MainPage extends PureComponent {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    setTab: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    resetNamespace: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const tab     = this.props.match.params.tab || tabs[0]; // eslint-disable-line react/prop-types
    const nextTab = nextProps.match.params.tab || tabs[0];  // eslint-disable-line react/prop-types

    // clear filters if location search parameter is changed by Menu click
    if (nextProps.location.search !== this.props.location.search// eslint-disable-line react/prop-types
      && !nextProps.location.search) { // eslint-disable-line react/prop-types
      nextProps.resetNamespace(`publications-${tab}`);
    }

    if (nextTab !== tab) {
      nextProps.setTab(nextTab);
    }
  }

  render() {
    const { match, t } = this.props;
    const active       = match.params.tab || tabs[0];

    const submenuItems = tabs.map(x => (
      <Menu.Item
        key={x}
        name={x}
        as={NavLink}
        to={`/publications/${x}`}
        active={active === x}
      >
        {t(`publications.tabs.${x}`)}
      </Menu.Item>
    ));

    let content = null;
    switch (active) {
    case 'articles':
      content = <Articles />;
      break;
    case 'blog':
      content = <Blog namespace="publications-blog" />;
      break;
    case 'twitter':
      content = <Twitter namespace="publications-twitter" />;
      break;
    default:
      content = <h1>Page not found</h1>;
      break;
    }

    return (
      <div>
        <SectionHeader section="publications" submenuItems={submenuItems} />
        {content}
      </div>
    );
  }
}

const mapDispatch = dispatch => (
  bindActionCreators({
    setTab: actions.setTab,
    resetNamespace: filterActions.resetNamespace
  }, dispatch)
);

export default connect(null, mapDispatch)(withNamespaces()(MainPage));
