import * as uaParserPkg from 'ua-parser-js';

const { UAParser } = uaParserPkg;

export const getDeviceInfo = uaString => {
  const ua = new UAParser(uaString);
  const device = ua.getDevice();
  const isMobile = device.type === 'mobile';

  return {
    isMobile,
    browserName: ua.getBrowser().name,
  };
};
