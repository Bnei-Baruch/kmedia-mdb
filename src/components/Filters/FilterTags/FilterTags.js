import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { Label } from 'semantic-ui-react';
import { selectors as filterSelectors, actions as filterActions } from '../../../redux/modules/filters';
import FilterTag from '../FilterTag/FilterTag';

const tagsData = {
  'date-filter': {
    icon: 'calendar',
    valueToLabel: (value) => {
      if (!value) {
        return '';
      }

      const { from, to } = value;
      const dateFormat = date => moment(new Date(date)).format('D MMM YYYY');

      if (value.from === value.to) {
        return dateFormat(from);
      }

      return `${dateFormat(from)} - ${dateFormat(to)}`;
    }
  },
  default: {
    icon: 'tag',
    valueToLabel: value => value
  }
};

const getTagData = (tagName) => {
  const tagData = tagsData[tagName];
  return tagData || tagsData.default;
};

class FilterTags extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any
    })),
    clearFilter: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    filters: []
  };

  render() {
    const { tags, namespace } = this.props;

    return (
      <Label.Group color="blue">
        {
          tags.map((tag) => {
            const tagData = getTagData(tag.name);
            return (
              <FilterTag
                key={tag.name}
                icon={tagData.icon}
                label={tagData.valueToLabel(tag.value)}
                onClose={() => {
                  this.props.clearFilter(namespace, tag.name);
                  this.props.onClose();
                }}
              />
            );
          })
        }
      </Label.Group>
    );
  }
}

export default connect(
  (state, ownProps) => {
    // TODO (yaniv): use reselect to cache selector
    const filters = filterSelectors.getFilters(state.filters, ownProps.namespace);

    const tags = reduce(filters, (acc, filter) => {
      const values = filter.values;
      return acc.concat(values.map(value => ({
        name: filter.name,
        value
      })));
    }, []);

    return { tags };
  },
  filterActions
)(FilterTags);
