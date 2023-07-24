import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Container, Grid, Header, List, Image, Icon, Button, } from 'semantic-ui-react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import { SectionLogo } from '../../helpers/images';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as likutim, actions } from '../../redux/modules/likutim';
import WipErr from '../shared/WipErr/WipErr';
import Link from '../Language/MultiLanguageLink';
import { canonicalLink } from '../../helpers/links';

const MIN_SHOWED                      = 3;
export const SearchResultLikutimByTag = ({ hit }) => {
  const { isMobileDevice }                = useContext(DeviceInfoContext);
  const [isMore, setIsMore]               = useState(false);
  const { _source: { title }, _uid: key } = hit;

  const { t } = useTranslation();
  const byKey = useSelector(state => likutim.getByTag(state.likutim));
  const wip   = useSelector(state => likutim.getWip(state.likutim, key));
  const err   = useSelector(state => likutim.getError(state.likutim, key));

  const denormCU = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const dispatch = useDispatch();

  const items = byKey(key);
  useEffect(() => {
    if (!wip && !err && !items) {
      dispatch(actions.fetchLikutimByTags(key));
    }
  }, [key, wip, err, !items]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  const handleShowMore = () => setIsMore(!isMore);

  return (
    <List.Item className="media_item">
      <List.Content>
        <Container className={clsx('padded', { 'padding_r_l_0': !isMobileDevice })}>
          <Header as="div">
            <Image size="small" verticalAlign="bottom">
              <SectionLogo name={'likutim'} height="50" width="50" />
            </Image>
            {title}
          </Header>
        </Container>
        <Grid columns={MIN_SHOWED} stackable={true}>
          <Grid.Row>
            {
              items?.filter(x => !!x)
                .filter((x, i) => {
                  return isMore || i < MIN_SHOWED;
                })
                .flatMap(id => denormCU(id))
                .map(item => (
                    <Grid.Column key={item.id} className="likutim_item_of_list">
                      <List.Item className="media_item">
                        <div className="media_item__content">
                          <Header as={Link} to={canonicalLink(item)} content={item.name} />
                          <span className="description">
                            {t('values.date', { date: item.film_date })}
                          </span>
                        </div>
                      </List.Item>
                    </Grid.Column>
                  )
                )
            }
          </Grid.Row>
        </Grid>
        {
          items?.length >= MIN_SHOWED && (
            <Button
              fluid
              textAlign="center"
              className="clear_button no-background margin-top-8 no-padding-bottom"
              onClick={handleShowMore}
            >
              <Icon name={`angle double ${isMore ? 'up' : 'down'}`} />
              {isMore ? 'show less' : `show all ${items?.length}`}
            </Button>
          )
        }
      </List.Content>
    </List.Item>
  );
};

