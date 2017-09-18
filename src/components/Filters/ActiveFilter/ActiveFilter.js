import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { Container } from 'semantic-ui-react';
import { filterPropShape } from '../../shapes';

class ActiveFilter extends PureComponent {
  static propTypes = {
    filters: PropTypes.arrayOf(filterPropShape).isRequired,
    activeFilterName: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired
  };

  static defaultProps = {
    activeFilterName: null
  };

  render() {
    const { activeFilterName, filters, onCancel, onApply, ...rest } = this.props;
    const activeFilter                                              = find(filters, filter => filter.name === activeFilterName);

    if (!activeFilter) {
      return null;
    }

    const { component: Component, name } = activeFilter;
    return (
      <div>
        <Container className="padded horizontally">
          <Component onCancel={onCancel} onApply={onApply} name={name} {...rest} />
        </Container>
      </div>
    );
  }
}

export default ActiveFilter;
