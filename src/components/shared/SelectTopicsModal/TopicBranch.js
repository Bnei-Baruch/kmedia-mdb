import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ITEMS_NUMBER = 5;

const TopicBranch = ({ leafs, selected, setSelected }) => {
  const { t }                 = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const children = leafs.filter(x => x.matched);

  if (!children?.length > 0) return null;

  const handleChange = (checked, id) => {
    if (checked) {
      setSelected([id, ...selected || []]);
    } else {
      setSelected(selected.filter(x => x !== id));
    }
  };

  const handleShowAll = () => setShowAll(!showAll);

  const renderNode = node => {
    if (!node) {
      return null;
    }

    const { text, value, children: leafs } = node;

    return (
      <li key={value}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected?.includes(value)}
            onChange={e => handleChange(e.target.checked, value)}
          />
          {text}
        </label>
        <TopicBranch
          setSelected={setSelected}
          selected={selected}
          leafs={leafs}
        />
      </li>
    );
  };

  return (
    <>
      <div className=" px-4  no-padding-top no-padding-bottom">
        <ul className="topics__list list-none">
          {
            (showAll ? children : children.slice(0, ITEMS_NUMBER)).map(renderNode)
          }
        </ul>
        {
          children.length >= ITEMS_NUMBER && (
            <button
              className="topics_button clear_button border border-gray-300 rounded px-3 py-1 small inline-flex items-center gap-1"
              onClick={handleShowAll}
            >
              <span className="material-symbols-outlined text-blue-500 small">
                {showAll ? 'remove' : 'add'}
              </span>
              {t(`topics.show-${showAll ? 'less' : 'more'}`)}
            </button>
          )
        }
      </div>
    </>
  );
};

TopicBranch.propTypes = {
  leafs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  setSelected: PropTypes.func.isRequired
};

export default TopicBranch;
