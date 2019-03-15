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

  componentWillReceiveProps(nextProps) {
    const { match, location } = this.props;
    const tab                 = match.params.tab || tabs[0]; // eslint-disable-line react/prop-types
    const nextTab             = nextProps.match.params.tab || tabs[0]; // eslint-disable-line react/prop-types

    // clear filters if location search parameter is changed by Menu click
    if (nextProps.location.search !== location.search // eslint-disable-line react/prop-types
      && !nextProps.location.search) { // eslint-disable-line react/prop-types
      nextProps.resetNamespace(`programs-${tab}`);
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
        to={`/programs/${x}`}
        active={active === x}
      >
        {t(`programs.tabs.${x}`)}
      </Menu.Item>
    ));

    let content = null;
    switch (active) {
    case 'main':
      content = <ProgramList />;
      break;
    case 'clips':
      content = <ClipList />;
      break;
    default:
      content = <h1>Page not found</h1>;
      break;
    }

    return (
      <div>
        <SectionHeader section="programs" submenuItems={submenuItems} />
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
