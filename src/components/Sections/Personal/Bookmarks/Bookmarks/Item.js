import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../redux/modules/mdb';
import { SectionLogo } from '../../../../../helpers/images';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';

const BookmarksItem = ({ bookmark }) => {
  const { id } = bookmark;
  const cu     = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, bookmark.source_id));

  return (
    <List.Item className="padded" key={id}>
      <List.Icon>
        <Link to={{ pathname: canonicalLink(cu) }}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' width='25' height='25' />
          </Image>
        </Link>
      </List.Icon>
      <List.Content>
        <List.Header>
          {bookmark.name}
        </List.Header>
        <List.Description>
          Updated 10 mins ago
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

export default withNamespaces()(BookmarksItem);
