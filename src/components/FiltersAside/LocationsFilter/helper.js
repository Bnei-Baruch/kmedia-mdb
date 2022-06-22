export const getTitle = (key, t) => t(`locations.${key.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: key });
