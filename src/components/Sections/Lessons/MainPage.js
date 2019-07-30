import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/lessons';
import { actions as filterActions } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import Daily from './tabs/Daily/Container';
import Series from './tabs/Series/Container';
import Lectures from './tabs/Lectures/Container';

export const tabs = [
  'daily',
  'virtual',
  'lectures',
  'women',
  'rabash',
  // 'children',
  'series',
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
    if (nextProps.location.search !== this.props.location.search
      && !nextProps.location.search) {
      nextProps.resetNamespace(`lessons-${tab}`);
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
        to={`/lessons/${x}`}
        active={active === x}
      >
        {t(`lessons.tabs.${x}`)}
      </Menu.Item>
    ));

    let content = null;
    switch (active) {
    case 'daily':
      content = <Daily />;
      break;
    case 'virtual':
    case 'lectures':
    case 'women':
    case 'rabash':
      // case 'children':
      content = <Lectures tab={active} />;
      break;
    case 'series':
      content = <Series />;
      break;
    default:
      content = <h1>Page not found</h1>;
      break;
    }

    return (
      <div>
        <SectionHeader section="lessons" submenuItems={submenuItems} />
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
