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
import AudioBlog from './tabs/AudioBlog/Container';

export const tabs = [
  'blog',
  'twitter',
  'articles',
  'audio-blog'
];

class MainPage extends PureComponent {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    setTab: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    resetNamespace: PropTypes.func.isRequired
  };

  static content = (active) => {
    switch (active) {
    case 'articles':
      return <Articles />;
    case 'blog':
      return <Blog namespace="publications-blog" />;
    case 'twitter':
      return <Twitter namespace="publications-twitter" />;
    case 'audio-blog':
      return <AudioBlog />;
    default:
      return <h1>Page not found</h1>;
    }
  }

  componentDidUpdate(prevProps){
    const { match, location, resetNamespace, setTab } = this.props;

    const tab     = prevProps.match.params.tab || tabs[0];
    const nextTab = match.params.tab || tabs[0];

    // clear filters if location search parameter is changed by Menu click
    if (location.search !== prevProps.location.search
        && !location.search) {
      resetNamespace(`publications-${tab}`);
    }

    if (nextTab !== tab) {
      setTab(nextTab);
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

    return (
      <div>
        <SectionHeader section="publications" submenuItems={submenuItems} />
        {MainPage.content(active)}
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
