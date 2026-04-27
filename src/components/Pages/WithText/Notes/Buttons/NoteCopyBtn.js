import React from 'react';
import CopyWithPopupBtn from '../../../../shared/CopyWithPopupBtn';

const NoteCopyBtn = ({ text }) => (
  <CopyWithPopupBtn text={text}>
    <button className="clear_button">
      <span className="material-symbols-outlined">file_copy</span>
    </button>
  </CopyWithPopupBtn>
);

export default NoteCopyBtn;
