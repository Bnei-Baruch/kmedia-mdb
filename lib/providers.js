'use client';
import { Provider } from 'react-redux';

import { reduxStore } from '/lib/redux/store';
import { DeviceInfoContext, } from '/src/helpers/app-contexts';
//import ClientChronicles, { ChroniclesActions } from '/src/helpers/clientChronicles';
import React from 'react';
import UAParser from 'ua-parser-js';

//import { createBrowserHistory } from 'history';
//import { CreateAbTesting } from '/src/helpers/ab-testing';

export const Providers = ({ children }) => {
  const deviceInfo        = new UAParser().getResult();
  const deviceInfoContext = {
    deviceInfo,
    isMobileDevice: deviceInfo.device?.type === 'mobile',
    undefinedDevice: deviceInfo.device?.type === undefined,
    isIPhone: ['iPhone Simulator', 'iPhone'].includes(deviceInfo.device?.model)
  };

  // const clientChronicles = new ClientChronicles(history, reduxStore);
  // const abTesting        = CreateAbTesting(clientChronicles.userId);

  //console.log('Providers', deviceInfoContext);
  return (
    <Provider store={reduxStore}>
      {/*<InitKCEvents />*/}
      {/* <ClientChroniclesContext.Provider value={clientChronicles}>
        <AbTestingContext.Provider value={abTesting}>*/}
      <DeviceInfoContext.Provider value={deviceInfoContext}>
        {/*<ChroniclesActions />*/}
        {children}
      </DeviceInfoContext.Provider>
      {/* </AbTestingContext.Provider>
      </ClientChroniclesContext.Provider>*/}
    </Provider>
  );
};
