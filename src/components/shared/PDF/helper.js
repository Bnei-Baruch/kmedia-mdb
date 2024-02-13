import { BS_TAAS_PARTS, BS_TAAS_PARTS_PARTS_ONLY } from '../../../helpers/consts';
import { stringify } from '../../../helpers/url';

export const isTaas = source => (BS_TAAS_PARTS[source] !== undefined) || (BS_TAAS_PARTS_PARTS_ONLY[source] !== undefined);

export const startsFrom = source => BS_TAAS_PARTS[source];

export const goOtherTassPart = (page, isGoPrev = false, navigate) => {
  const [uid] = Object.entries(BS_TAAS_PARTS).reverse().find(x => x[1] <= page);
  navigate(
    {
      pathname: `../sources/${uid}`,
      search: stringify({ page })
    },
    { state: { isGoPrev } }
  );
};