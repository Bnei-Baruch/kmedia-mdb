import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Label } from 'semantic-ui-react';
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

const FilterTags = (props) => {
  const { tags, onTagClose } = props;

  return (
    <Label.Group color="blue">
      {
        tags.map((tag) => {
          const tagData = getTagData(tag.name);
          return (
            <FilterTag
              icon={tagData.icon}
              label={tagData.valueToLabel(tag.value)}
              onClose={() => onTagClose(tag.name)}
            />
          );
        })
      }
    </Label.Group>
  );
};

FilterTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any
  })),
  onTagClose: PropTypes.func.isRequired
};

FilterTags.defaultProps = {
  tags: []
};

export default FilterTags;
