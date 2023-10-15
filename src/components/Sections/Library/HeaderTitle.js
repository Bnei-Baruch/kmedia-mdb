import { Segment, Header } from 'semantic-ui-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors as sources } from '../../../../lib/redux/slices/sourcesSlice';
import TagsByUnit from '../../shared/TagsByUnit';
import { parentIdByPath, getFullPath } from './helper';

const SourceHeaderTitle = ({ id }) => {
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));
  const getPathByID   = useSelector(state => sources.getPathByID(state.sources));

  const source = getSourceById(id);
  if (!source) {
    return <Segment basic>&nbsp;</Segment>;
  }

  const path         = getFullPath(id, getPathByID);
  const parentId     = parentIdByPath(path);
  const parentSource = getSourceById(parentId);

  if (!parentSource) {
    return <Segment basic>&nbsp;</Segment>;
  }

  const { name: sourceName }                                         = source;
  const { name: parentName, full_name: parentFullName, description } = parentSource;

  let displayName = parentFullName || parentName;
  if (parentFullName && parentName) {
    displayName += ` (${parentName})`;
  }

  return (
    <div className="source__header-title">
      <Header size="small">
        {/*<Helmets.Basic title={`${sourceName} - ${parentName} - ${parentName}`} description={description} />*/}
        <Header.Subheader>
          <small>
            {`${displayName} / ${parentName} ${description || ''} `}
          </small>
        </Header.Subheader>
        <span>{sourceName}</span>
      </Header>
      <TagsByUnit id={id} />
    </div>
  );
};

export default SourceHeaderTitle;
