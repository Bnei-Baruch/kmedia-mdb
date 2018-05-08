import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/lectures';
import { actions as filterActions } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import UnitList from './tabs/UnitList/Container';

export const tabs = [
  'virtual-lessons',
  'lectures',
  'women-lessons',
  'children-lessons'
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
    const tab     = this.props.match.params.tab || tabs[0];
    const nextTab = nextProps.match.params.tab || tabs[0];

    // clear filters if location search parameter is changed by Menu click
    if (nextProps.location.search !== this.props.location.search &&
      !nextProps.location.search) {
      nextProps.resetNamespace(`lectures-${tab}`);
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
        to={`/lectures/${x}`}
        active={active === x}
      >
        {t(`lectures.tabs.${x}`)}
      </Menu.Item>
    ));

    let content = null;
    switch (active) {
    case 'virtual-lessons':
    case 'lectures':
    case 'women-lessons':
    case 'children-lessons':
      content = <UnitList tab={active} />;
      break;
    default:
      content = <h1>Page not found</h1>;
      break;
    }

    return (
      <div>
        <SectionHeader section="lectures" submenuItems={submenuItems} />
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

export default connect(null, mapDispatch)(translate()(MainPage));
