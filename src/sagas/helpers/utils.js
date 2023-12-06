export const cuFilesToData = cu => !cu.files ? {} : cu.files.reduce((acc, f) => {
  const { language, name } = f;
  if (!acc[language])
    acc[language] = {};

  const ext          = name.split('.').slice(-1);
  acc[language][ext] = f;
  return acc;
}, {});

export const getSourceIndexId = action => {
  let id = action.payload;
  if (/^gr-/.test(id)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(id);
    id           = result[1];
  }

  return id;
};
