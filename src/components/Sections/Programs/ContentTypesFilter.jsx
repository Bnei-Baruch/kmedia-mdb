import {
  CT_CLIP,
  CT_CLIPS,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  FN_CONTENT_TYPE,
  UNIT_PROGRAMS_TYPE
} from '../../../helpers/consts';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsByCtBtn from '../../FiltersAside/CollectionsByCt/CollectionsByCtBtn';

const cCtByUnitCt = {
  [CT_VIDEO_PROGRAM_CHAPTER]: CT_VIDEO_PROGRAM,
  [CT_CLIP]                 : CT_CLIPS,
};

const ContentTypesFilter = ({ namespace }) => (
  <FilterHeader
    filterName={FN_CONTENT_TYPE}
    children={UNIT_PROGRAMS_TYPE.map(ct => (
      <CollectionsByCtBtn
        namespace={namespace}
        key={ct}
        ct={ct}
        modalCt={cCtByUnitCt[ct]}
      />
    )
    )}
  />
);

export default ContentTypesFilter;
