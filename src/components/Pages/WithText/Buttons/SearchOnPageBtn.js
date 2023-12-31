import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Popup, Search, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import { searchOnPage } from './helper';
import { DOM_ROOT_ID } from '../scrollToSearch/helper';

const SearchOnPageBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSearchChange  = (e, { value }) => {
    window.getSelection().removeAllRanges()
    window.find(value)
    /*const res = searchOnPage(value, document.getElementById(DOM_ROOT_ID));
    if (res.length === 0) return;
    window.getSelection().empty();
    window.getSelection().addRange(res[0]);*/
  };

  return (
    <Popup
      trigger={
        <Button
          compact
          size="small"
          icon={
            <span className="material-symbols-outlined">search</span>
          }
        />
      }
      on="click"
      position="bottom right"
      flowing
      hideOnScroll
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
    >
      <Popup.Content>
        <Input icon="search" placeholder="Search..." onChange={debounce(handleSearchChange, 500,)} />
      </Popup.Content>
    </Popup>
  );
};

export default SearchOnPageBtn;
