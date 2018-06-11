import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Header, Icon, Menu, Popup } from 'semantic-ui-react';

import { getLanguageDirection } from '../../helpers/i18n-utils';
import { filtersTransformer } from '../../filters/index';
import { actions, selectors } from '../../redux/modules/filters';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as settings } from '../../redux/modules/settings';
import * as shapes from '../shapes';
import FiltersHydrator from './FiltersHydrator';

class Filters extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(shapes.filterPropShape).isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.node),
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    filtersData: PropTypes.objectOf(PropTypes.object).isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    rightItems: null,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  state = {
    activeFilter: null,
  };

  handlePopupClose = () =>
    this.setState({ activeFilter: null });

  handlePopupOpen = activeFilter =>
    this.setState({ activeFilter });

  handleApply = (name, value) => {
    this.handlePopupClose();
    this.props.setFilterValue(this.props.namespace, name, value);
    this.props.onChange();
  };

  handleResetFilter = (e, name) => {
    e.stopPropagation();
    this.props.resetFilter(this.props.namespace, name);
    this.props.onChange();
  };

  render() {
    const { filters, namespace, onHydrated, t, filtersData, rightItems, language } = this.props;
    const { activeFilter }                                                         = this.state;
    const { store }                                                                = this.context;

    return (
      <div className="filter-panel">
        <FiltersHydrator namespace={namespace} onHydrated={onHydrated} />
        <Menu secondary pointing stackable className="index-filters" size="large">
          <Container className="padded horizontally">
            <Menu.Item header content={t('filters.by')} />
            {
              filters.map((item) => {
                const { component: FilterComponent, name } = item;

                const isActive = name === activeFilter;
                const data     = filtersData[name] || {};
                const values   = data.values || [];
                const value    = Array.isArray(values) && values.length > 0 ? values[0] : null;
                const label    = value ?
                  filtersTransformer.valueToTagLabel(name, value, this.props, store, t) :
                  t('filters.all');

                return (
                  <Popup
                    basic
                    flowing
                    key={name}
                    trigger={
                      <Menu.Item name={name}>
                        <Header
                          size="tiny"
                          content={t(`filters.${name}.label`)}
                          subheader={label}
                        />
                        <Icon size="large" name={`triangle ${isActive ? 'up' : 'down'}`} />
                        {
                          value ?
                            <Icon
                              name="trash outline"
                              onClick={e => this.handleResetFilter(e, name)}
                            /> :
                            null
                        }
                      </Menu.Item>
                    }
                    on="click"
                    position="bottom left"
                    verticalOffset={-12}
                    open={isActive}
                    onClose={this.handlePopupClose}
                    onOpen={() => this.handlePopupOpen(name)}
                    style={{
                      padding: 0,
                      direction: getLanguageDirection(language)
                    }}
                  >
                    <Popup.Content className={`filter-popup ${getLanguageDirection(language)}`}>
                      <FilterComponent
                        value={value}
                        onCancel={this.handlePopupClose}
                        onApply={x => this.handleApply(name, x)}
                        language={language}
                        t={t}
                      />
                    </Popup.Content>
                  </Popup>
                );
              })
            }
            {
              rightItems ?
                <Menu.Menu position="right">{rightItems}</Menu.Menu>
                : null
            }
          </Container>
        </Menu>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    filtersData: selectors.getNSFilters(state.filters, ownProps.namespace),
    language: settings.getLanguage(state.settings),

    // DO NOT REMOVE, this triggers a necessary re-render for filter tags
    sqDataWipErr: mdb.getSQDataWipErr(state.mdb),
  }),
  disptach => bindActionCreators({
    setFilterValue: actions.setFilterValue,
    resetFilter: actions.resetFilter,
  }, disptach)
)(translate()(Filters));
