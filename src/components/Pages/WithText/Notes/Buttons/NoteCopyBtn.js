import React from 'react';
import { Button } from 'semantic-ui-react';
import CopyWithPopupBtn from '../../../../shared/CopyWithPopupBtn';

const NoteCopyBtn = ({ text }) => (
  <CopyWithPopupBtn text={text}>
    <Button
      basic
      className="clear_button"
      icon={<span className="material-symbols-outlined">file_copy</span>}
    />
  </CopyWithPopupBtn>
);

export default NoteCopyBtn;
