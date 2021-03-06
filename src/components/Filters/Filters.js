import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect, ReactReduxContext } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Icon, Label, Menu, Popup } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { getLanguageDirection } from '../../helpers/i18n-utils';
import { filtersTransformer } from '../../filters/index';
import { actions, selectors } from '../../redux/modules/filters';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as settings } from '../../redux/modules/settings';
import * as shapes from '../shapes';
import FiltersHydrator from './FiltersHydrator';
import { DeviceInfoContext } from '../../helpers/app-contexts';

class Filters extends Component {
  static contextType = DeviceInfoContext;

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
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    sqDataWipErr: PropTypes.bool
  };

  static defaultProps = {
    rightItems: null,
  };

  state = {
    activeFilter: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { namespace, language, contentLanguage, filters, rightItems, filtersData, sqDataWipErr } = this.props;
    const { activeFilter }                                                                         = this.state;

    return (activeFilter !== nextState.activeFilter
      || namespace !== nextProps.namespace
      || language !== nextProps.language
      || contentLanguage !== nextProps.contentLanguage
      || sqDataWipErr !== nextProps.sqDataWipErr
      || !isEqual(filters, nextProps.filters)
      || !isEqual(rightItems, nextProps.rightItems)
      || !isEqual(filtersData, nextProps.filtersData));
  }

  handlePopupClose = () => {
    this.setState({ activeFilter: null });
    document.getElementsByTagName('body')[0].classList.remove('noscroll--smallmobile');
  };

  handlePopupOpen = activeFilter => {
    this.setState({ activeFilter });
    document.getElementsByTagName('body')[0].classList.add('noscroll--smallmobile');
  };

  handleApply = (name, value) => {
    const { props: { setFilterValue, namespace, onChange } } = this;
    this.handlePopupClose();
    setFilterValue(namespace, name, value);
    onChange();
  };

  handleResetFilter = (e, name) => {
    const { props: { resetFilter, namespace, onChange } } = this;
    e.stopPropagation();
    resetFilter(namespace, name);
    onChange();
  };

  renderFilters = (store, langDir, popupStyle) => {
    const { filters, namespace, t, filtersData, language, contentLanguage } = this.props;
    const { activeFilter }                                                  = this.state;
    const { isMobileDevice }                                                = this.context;

    return filters.map(item => {
      const { component: FilterComponent, name } = item;

      const isActive = name === activeFilter;
      const data     = filtersData[name] || {};
      const values   = data.values || [];
      const value    = Array.isArray(values) && values.length > 0 ? values[0] : null;
      const label    = value
        ? filtersTransformer.valueToTagLabel(name, value, this.props, store, t)
        : t('filters.all');

      const len = ((name === 'topics-filter' || name === 'sources-filter') && value) ? label.length : 0;
      const cn  = clsx('filter-popup', { mobile: isMobileDevice });

      return (
        <Popup
          className="filter-popup"
          basic
          flowing
          key={name}
          popper={{ id: 'filter-popup', className: cn }}
          trigger={(
            <Menu.Item
              style={{ flexShrink: len }}
              className={clsx(`filter filter--${name}`,
                { 'filter--is-empty': !value },
                { 'filter--is-active': isActive })}
              name={name}
            >
              <div className="filter__wrapper">
                <small className="blue text filter__title">
                  {t(`filters.${name}.label`)}
                </small>
                <span className="filter__state">
                  <span className="filter__text" dangerouslySetInnerHTML={{ __html: label }} />
                  {
                    isActive
                      ? <Icon className="filter__fold-icon" name="dropdown" flipped="vertically" />
                      : <Icon className="filter__fold-icon" name="dropdown" />
                  }
                </span>
              </div>
              {
                value
                  ? (
                    <div className="filter__clear">
                      <Label
                        basic
                        circular
                        size="tiny"
                        onClick={e => this.handleResetFilter(e, name)}
                      >
                        <Icon name="times" />
                      </Label>
                    </div>
                  )
                  : null
              }
            </Menu.Item>
          )}
          on="click"
          position={`bottom ${langDir === 'ltr' ? 'left' : 'right'}`}
          open={isActive}
          onClose={this.handlePopupClose}
          onOpen={() => this.handlePopupOpen(name)}
          style={popupStyle}
          closeOnDocumentClick={false}
        >
          <Popup.Content className={`filter-popup__content ${langDir}`}>
            <FilterComponent
              namespace={namespace}
              value={value}
              onCancel={this.handlePopupClose}
              onApply={x => this.handleApply(name, x)}
              language={language}
              contentLanguage={contentLanguage}
            />
          </Popup.Content>
        </Popup>
      );
    });
  };

  render() {
    const { namespace, onHydrated, t, rightItems, language } = this.props;

    const langDir    = getLanguageDirection(language);
    const popupStyle = {
      direction: langDir,
    };

    return (
      <div className="filters">
        <FiltersHydrator namespace={namespace} onHydrated={onHydrated} />
        <Container className="padded">
          <Menu className="filters__menu" stackable>
            <Menu.Item
              header
              className="filters__header"
              content={t('filters.by')}
            />
            <ReactReduxContext.Consumer>
              {({ store }) => (this.renderFilters(store, langDir, popupStyle))}
            </ReactReduxContext.Consumer>
            {
              rightItems && <Menu.Menu position="right">{rightItems}</Menu.Menu>
            }
          </Menu>
        </Container>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    filtersData: selectors.getNSFilters(state.filters, ownProps.namespace),
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),

    // DO NOT REMOVE, this triggers a necessary re-render for filter tags
    sqDataWipErr: mdb.getSQDataWipErr(state.mdb),
  }),
  dispatch => bindActionCreators({
    setFilterValue: actions.setFilterValue,
    resetFilter: actions.resetFilter,
  }, dispatch)
)(withNamespaces()(Filters));
