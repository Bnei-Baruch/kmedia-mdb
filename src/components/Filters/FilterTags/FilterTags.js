import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { Label } from 'semantic-ui-react';
import { selectors as filterSelectors, actions as filterActions } from '../../../redux/modules/filters';
import FilterTag from '../FilterTag/FilterTag';
// Remove this when move to redux
import dataLoader from '../dataLoader';

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
  'sources-filter': {
    icon: 'book',
    // Remove props when moveing sources to redux, then use store instead of props.
    valueToLabel: (value, props) => {
      if (!value) {
        return '';
      }

      return value.map(codeOrId => props.sources[codeOrId]).join(' > ');
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
    removeFilter: PropTypes.func.isRequired,
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
                key={tag.name + "_" + tag.index}
                icon={tagData.icon}
                label={tagData.valueToLabel(tag.value, this.props)}
                onClose={() => {
                  this.props.removeFilter(namespace, tag.name, tag.index);
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

// This should move to redux sources which will enable map from value to name (label) for tags.
const buildSources = (json) => {
  if (!json) {
    return {};
  }

  const sources = json.reduce((acc, s) => {
    const codeOrId = s.code || s.id;
    acc[codeOrId] = s.name;
    return {...acc, ...buildSources(s.children)};
  }, {});
  return sources;
};

const FilterTagsWithData = dataLoader(() =>
  fetch('http://rt-dev.kbb1.com:8080/hierarchy/sources/')
    .then(response => response.json())
    .then(json => ({ sources: buildSources(json) }))
)(FilterTags);


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
)(FilterTagsWithData);

