import { Provider } from 'react-redux';

import { wrapper } from '/lib/redux';
import { DeviceInfoContext, } from '/src/helpers/app-contexts';
//import ClientChronicles, { ChroniclesActions } from '/src/helpers/clientChronicles';
import React from 'react';
//import { createBrowserHistory } from 'history';
//import { CreateAbTesting } from '/src/helpers/ab-testing';

export const Providers = ({ deviceInfo, children }) => {
  const deviceInfoContext = {
    deviceInfo,
    isMobileDevice: deviceInfo.device?.type === 'mobile',
    undefinedDevice: deviceInfo.device?.type === undefined,
    isIPhone: ['iPhone Simulator', 'iPhone'].includes(deviceInfo.device?.model)
  };
  //const history           = createBrowserHistory();

  // const clientChronicles = new ClientChronicles(history, reduxStore);
  // const abTesting        = CreateAbTesting(clientChronicles.userId);
  const {store, props} = wrapper.useWrappedStore({  });
  //console.log('Providers', deviceInfoContext);
  return (
    <Provider store={store}>
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
