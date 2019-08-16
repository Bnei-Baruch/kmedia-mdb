import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/programs';
import { actions as filterActions } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import ProgramList from './tabs/Programs/List';
import ClipList from './tabs/Clips/List';

export const tabs = [
  'main',
  'clips'
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
    case 'main':
      return <ProgramList />;
    case 'clips':
      return <ClipList />;
    default:
      return <h1>Page not found</h1>;
    }
  };

  componentDidUpdate(prevProps){
    const { match, location, resetNamespace, setTab } = this.props;
    
    const tab = prevProps.match.params.tab || tabs[0]; 
    const nextTab = match.params.tab || tabs[0];

    // clear filters if location search parameter is changed by Menu click
    if (location.search !== prevProps.location.search
      && !location.search) {
      resetNamespace(`programs-${tab}`);
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
        to={`/programs/${x}`}
        active={active === x}
      >
        {t(`programs.tabs.${x}`)}
      </Menu.Item>
    ));

    return (
      <div>
        <SectionHeader section="programs" submenuItems={submenuItems} />
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
