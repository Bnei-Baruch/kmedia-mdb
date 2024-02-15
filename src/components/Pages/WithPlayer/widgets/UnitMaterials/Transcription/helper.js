import MediaHelper from '../../../../../../helpers/media';

export const transcriptionFileFilter = f => MediaHelper.IsText(f) && (f.insert_type === 'tamlil' || !f.insert_type);
