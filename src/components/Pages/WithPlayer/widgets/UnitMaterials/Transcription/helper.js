import MediaHelper from '../../../../../../helpers/media';
import { INSERT_TYPE_TAMLIL } from '../../../../../../helpers/consts';

export const transcriptionFileFilter = f => MediaHelper.IsText(f) && (f.insert_type === INSERT_TYPE_TAMLIL || !f.insert_type);
