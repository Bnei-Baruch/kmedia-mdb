import { BS_TAAS_PARTS, BS_TAAS_PARTS_PARTS_ONLY } from '../../../helpers/consts';

export const isTaas = source => (BS_TAAS_PARTS[source] !== undefined) || (BS_TAAS_PARTS_PARTS_ONLY[source] !== undefined);

export const startsFrom = source => BS_TAAS_PARTS[source];
