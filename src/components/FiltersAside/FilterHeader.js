import React, { useState } from 'react';
import { Button, List } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

const FilterHeader = ({ filterName, t, children }) => {
  const [open, setOpen] = useState(true);
  const toggleOpen      = () => setOpen(!open);
  return (
    <List className="filter_aside">
      <List.Header className="title">
        {t(`filters.aside-filter.${filterName}`)}
        <Button
          basic
          floated="right"
          color="blue"
          size="big"
          className="clear_button"
          icon={{ name: `caret ${open ? 'up' : 'down'}` }}
          onClick={toggleOpen}
        />
      </List.Header>
      {open && children}
    </List>
  );
};

export default withNamespaces()(FilterHeader);
