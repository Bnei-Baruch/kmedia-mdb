export const getTitle = (key, t) => {
  return t(`locations.${key.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: key });
};
