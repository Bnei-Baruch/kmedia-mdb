import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Header, Icon, Menu, Popup } from 'semantic-ui-react';

import { filtersTransformer } from '../../filters/index';
import { actions, selectors } from '../../redux/modules/filters';
import { selectors as mdb } from '../../redux/modules/mdb';
import { filterPropShape } from '../shapes';
import FiltersHydrator from '../Filters/FiltersHydrator';

class Filters2 extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    resetFilter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired,
    filtersData: PropTypes.objectOf(PropTypes.object).isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.node),
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

  handleApply = () => {
    this.props.onChange();
    this.handlePopupClose();
  };

  handlePopupClose = () =>
    this.setState({ activeFilter: null });

  handlePopupOpen = activeFilter =>
    this.setState({ activeFilter });

  handleResetFilter = (e, name) => {
    e.stopPropagation();
    this.props.resetFilter(this.props.namespace, name);
  };

  render() {
    const { filters, namespace, onHydrated, t, filtersData } = this.props;
    const { activeFilter }                                   = this.state;
    const { store }                                          = this.context;

    console.log('Filters2.render', filtersData);

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
                  filtersTransformer.valueToTagLabel(name, values[0], this.props, store, t) :
                  t('filters.holidays-filter.allItem');

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
                              onClick={e => this.handleResetFilter(e, item.name)}
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
                    onOpen={() => this.handlePopupOpen(item.name)}
                    style={{ padding: 0 }}
                  >
                    <Popup.Content className="filter-popup">
                      <FilterComponent
                        namespace={namespace}
                        name={item.name}
                        onCancel={this.handlePopupClose}
                        onApply={this.handleApply}
                      />
                    </Popup.Content>
                  </Popup>
                );
              })
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

    // DO NOT REMOVE, this triggers a necessary re-render for filter tags
    sqDataWipErr: mdb.getSQDataWipErr(state.mdb),
  }),
  disptach => bindActionCreators({ resetFilter: actions.resetFilter }, disptach)
)(translate()(Filters2));
