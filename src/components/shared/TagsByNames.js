import { Button } from 'semantic-ui-react';
import Link from '../Language/MultiLanguageLink';
import React from 'react';
import { isEmpty } from '../../helpers/utils';

const TagsByNames = ({ names }) => {
  if (isEmpty(names)) return;

  return (
    <div className="unit-tags-bar">
      {
        names
          .map((tag, index) =>
            <Button key={`${tag.id}${index}`} basic compact size="small">
              <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
            </Button>
          )
      }
    </div>
  );
};

export default TagsByNames;
