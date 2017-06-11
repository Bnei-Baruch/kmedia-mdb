import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { Label } from 'semantic-ui-react';
import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';
import FilterTag from '../FilterTag/FilterTag';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../redux/modules/tags';

const tagsData = {
  'date-filter': {
    icon: 'calendar',
    valueToLabel: (value) => {
      if (!value) {
        return '';
      }

      const { from, to } = value;
      const dateFormat   = date => moment(new Date(date)).format('D MMM YYYY');

      if (value.from === value.to) {
        return dateFormat(from);
      }

      return `${dateFormat(from)} - ${dateFormat(to)}`;
    }
  },
  'sources-filter': {
    icon: 'book',
    valueToLabel: (value, props, { getState }) => {
      if (!value) {
        return '';
      }

      const getSourceById = sources.getSourceById(getState().sources);
      const path          = value.map(x => getSourceById(x));

      // Make sure we have all items.
      // Location hydration probably happens before we receive sources
      return path.some(x => !x) ? '' : path.map(x => x.name).join(' > ');
    }
  },
  'topics-filter': {
    icon: 'tag',
    valueToLabel: (value, props, { getState }) => {
      if (!value) {
        return '';
      }
      return tagsSelectors.getTagLabel(getState().tags)(value);
    }
  },
  __default: {
    icon: 'tag',
    valueToLabel: value => value
  }
};

const getTagData = (tagName) => {
  const tagData = tagsData[tagName];
  return tagData || tagsData.__default;
};

class FilterTags extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any
    })),
    removeFilter: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: []
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
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
                key={`${tag.name}_${tag.index}`}
                icon={tagData.icon}
                label={tagData.valueToLabel(tag.value, this.props, this.context.store)}
                onClose={() => {
                  this.props.removeFilter(namespace, tag.name, tag.value);
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
      return acc.concat(values.map((value, index) => ({
        name: filter.name,
        index,
        value
      })));
    }, []);

    return { tags };
  },
  filterActions
)(FilterTags);

