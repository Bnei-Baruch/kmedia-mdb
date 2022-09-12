import { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { List } from 'semantic-ui-react';
import { isEmpty } from '../../../../src/helpers/utils';


const AlphabetFilter = ({ letters, onLetterClick, t }) => {
  const [clickedLetter, setClickedLetter] = useState(null);

  const labelOnClick = (e, data) => {
    const letter = data.content
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
    <List horizontal relaxed divided verticalAlign="middle">
      <List.Item
        key='all'
        as='a'
        onClick={() => processClicked(null)}
        active={clickedLetter == null}
        content={t('filters.all')}
      />
      {
        letters.sort().map(lt =>
          <List.Item
            key={lt}
            as='a'
            onClick={labelOnClick}
            active={clickedLetter && lt === clickedLetter}
            content={lt}
          />
        )
      }
    </List>
  );
}

AlphabetFilter.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLetterClick: PropTypes.func.isRequired
}

export default withTranslation()(AlphabetFilter);
