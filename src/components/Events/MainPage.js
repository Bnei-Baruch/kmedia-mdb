import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions } from '../../redux/modules/events';
import * as shapes from '../shapes';
import NavLink from '../Language/MultiLanguageNavLink';
import SectionHeader from '../shared/SectionHeader';
import CollectionList from './tabs/CollectionList/Container';
import UnitList from './tabs/UnitList/Container';

const tabs = [
  'conventions',
  'holidays',
  'picnics',
  'unity-days',
  'friends-gatherings',
  'meals',
];

class MainPage extends PureComponent {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    setTab: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const tab     = this.props.match.params.tab || tabs[0];
    const nextTab = nextProps.match.params.tab || tabs[0];
    if (nextTab !== tab) {
      nextProps.setTab(nextTab);
    }
  }

  render() {
    const { location, match, t } = this.props;
    const active                 = match.params.tab || tabs[0];

    const submenuItems = tabs.map(x => (
      <Menu.Item
        key={x}
        name={x}
        as={NavLink}
        to={`/events/${x}`}
        active={active === x}
      >
        {t(`events.tabs.${x}`)}
      </Menu.Item>
    ));

    let content = null;
    switch (active) {
    case 'conventions':
    case 'holidays':
    case 'picnics':
    case 'unity-days':
      content = <CollectionList tabName={active} />;
      break;
    case 'friends-gatherings':
    case 'meals':
      content = <UnitList tabName={active} location={location} />;
      break;
    default:
      content = <h1>Page not found</h1>;
      break;
    }

    return (
      <div>
        <SectionHeader section="events" submenuItems={submenuItems} />
        {content}
      </div>
    );
  }

}

const mapDispatch = dispatch => (
  bindActionCreators({
    setTab: actions.setTab,
  }, dispatch)
);

export default connect(null, mapDispatch)(translate()(MainPage));
