import { useState } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { isEmpty } from '../../../../src/helpers/utils';


const AlphabetFilter = ({ letters, onLetterClick }) => {
  const [clickedLetter, setClickedLetter] = useState(null);

  const labelOnClick = (e, data) => {
    const letter = data.children.props.children.trim()
    processClicked(letter === clickedLetter ? null : letter)
  }

  const processClicked = letter => {
    setClickedLetter(letter);
    onLetterClick(letter)
  }

  if (isEmpty(letters)) {
    return null;
  }

  return (
    <List horizontal relaxed divided>
      {
        letters.sort().map(lt =>
          <List.Item
            key={lt}
            as='a'
            onClick={labelOnClick}
            active={clickedLetter && lt === clickedLetter} >
            <List.Content verticalAlign="middle">
              {lt}
            </List.Content>
          </List.Item>
        )
      }
    </List>
  );
}

AlphabetFilter.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLetterClick: PropTypes.func.isRequired
}

export default AlphabetFilter;
