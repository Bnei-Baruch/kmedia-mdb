import * as uaParserPkg from 'ua-parser-js';

// Namespace import so the same module resolves cleanly in both the client and
// the SSR build (matches how the server consumed ua-parser-js previously).
const { UAParser } = uaParserPkg;

// Single source of truth for the device-info contract exposed through
// DeviceInfoContext. Works on the server (pass the request user-agent string)
// and on the client (omit the arg → reads navigator.userAgent).
export const getDeviceInfo = uaString => {
  const ua = new UAParser(uaString);
  const device = ua.getDevice();
  const isMobile = device.type === 'mobile';

  return {
    isMobile,
    browserName: ua.getBrowser().name,
  };
};
