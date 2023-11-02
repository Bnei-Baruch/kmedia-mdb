import { sqdata } from './helper';

export const fetchSQData = async function (uiLang, contentLanguages) {
  const data = await sqdata({ uiLang, contentLanguages });

  return data;
};

