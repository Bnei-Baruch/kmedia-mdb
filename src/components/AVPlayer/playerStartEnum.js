export const PlayerStartEnum = {
  'Start': 1,
  'Stop': 2,
  'UseParentLogic': 3,
  GetFromQuery: (query) => {
    if (query.autoPlay === '0') {
      return PlayerStartEnum.Stop;
    }
    if (query.autoPlay === '1') {
      return PlayerStartEnum.Start;
    }
    return PlayerStartEnum.UseParentLogic;
  }
};
