import { useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { stopBubbling } from '../../../../../helpers/utils';

const ZoomSizeBtns = () => {
  const dispatch      = useDispatch();
  const handleSetPlus = e => {
    dispatch(actions.setZoomSize('up'));
    stopBubbling(e);
  };

  const handleSetMinus = e => {
    dispatch(actions.setZoomSize('down'));
    stopBubbling(e);
  };

  return (
    <>
      <button onClick={handleSetPlus} className="flex-1 flex items-center justify-center px-4 py-[14.86px] hover:bg-black/3">
        <span className="font-bold text-[24px] leading-none">A</span>
        <span className="material-symbols-outlined text-[14px]! [font-variation-settings:'wght'_700]">add</span>
      </button>
      <button onClick={handleSetMinus} className="flex-1 flex items-center justify-center px-4 py-[14.86px] hover:bg-black/3">
        <span className="font-bold text-[24px] leading-none">A</span>
        <span className="material-symbols-outlined text-[14px]! [font-variation-settings:'wght'_700]">remove</span>
      </button>
    </>
  );
};

export default ZoomSizeBtns;
