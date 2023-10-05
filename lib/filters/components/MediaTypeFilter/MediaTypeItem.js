import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_MEDIA_TYPE } from '../../../../src/helpers/consts';
import { selectors as filterStats } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../helper';
import { definitionsByName } from '../../transformer';

const MediaTypeItem = ({ namespace, id }) => {
  const { t } = useTranslation();

  const filterName = FN_MEDIA_TYPE;

  const stat = useSelector(state => filterStats.getStats(state.filterStats, namespace, filterName)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();

  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, filterName, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  const selected = searchParams.getAll(definitionsByName[filterName].queryKey);

  return (
    <List.Item disabled={stat === 0}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.media-types.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default MediaTypeItem;
