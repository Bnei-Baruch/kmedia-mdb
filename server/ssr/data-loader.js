import { URL } from "url";
import { matchRoutes } from "react-router-dom";
import getRoutes from "../../src/route/routes";
import { backendApi } from "../../src/redux/api/backendApi";

/**
 * Gets SSR data promises for matched routes
 * @param {Object} store - Redux store
 * @param {string} originalUrl - Original request URL
 * @param {string} cookieUILang - UI language from cookie
 * @param {Array} cookieContentLanguages - Content languages from cookie
 * @param {boolean} showConsole - Debug flag
 * @param {Object} routeMatch - Matched route object with route and params
 * @returns {Promise} - Promise for route SSR data
 */
function getRoutePromises(store, originalUrl, cookieUILang, cookieContentLanguages, showConsole, { route, params }) {
  if (!route.ssrData) {
    return Promise.resolve(null);
  }

  showConsole && console.log("SSR data loader:", route.ssrData?.name);

  return route.ssrData(
    store,
    {
      params,
      parsedURL: new URL(originalUrl, "https://example.com"),
      uiLang: cookieUILang,
      contentLanguages: cookieContentLanguages,
    },
    showConsole
  );
}

/**
 * Loads all SSR data for the current route
 * @param {Object} options - Loading options
 * @returns {Promise} - Promise that resolves when all data is loaded
 */
export async function loadSSRData(options) {
  const { store, req, uiLang, cookieUILang, cookieContentLanguages, showConsole = false } = options;

  // Get routes without playerContainer (SSR doesn't need it)
  const routes = getRoutes(null).map((r) => ({
    ...r,
    path: `${uiLang}/${r.path}`,
  }));

  const reqPath = req.originalUrl.split("?")[0];
  const branch = matchRoutes(routes, reqPath) || [];

  let hrstart = process.hrtime();

  showConsole && console.log("SSR: Loading data for matched routes");

  const promises = branch.map((b) =>
    getRoutePromises(store, req.originalUrl, cookieUILang, cookieContentLanguages, showConsole, b)
  );

  // Add RTK Query promises
  try {
    const rtkQueriesThunk = backendApi.util?.getRunningQueriesThunk?.();
    if (rtkQueriesThunk) {
      const rtkPromises = await store.dispatch(rtkQueriesThunk);
      showConsole && console.log("SSR: Route promises: %d, RTK promises: %d", promises.length, rtkPromises?.length);
      rtkPromises.forEach((promise) => promises.push(promise));
    }
  } catch (error) {
    console.log("SSR: Error getting RTK queries:", error.message);
  }

  let hrend = process.hrtime(hrstart);
  showConsole && console.log("SSR: Fired SSR loaders in %ds %dms", hrend[0], hrend[1] / 1000000);

  hrstart = process.hrtime();

  await Promise.all(promises);

  hrend = process.hrtime(hrstart);
  showConsole && console.log("SSR: All promises resolved in %ds %dms", hrend[0], hrend[1] / 1000000);

  return { promises, branch };
}

/**
 * Waits for sagas to complete
 * @param {Object} store - Redux store
 * @param {boolean} showConsole - Debug flag
 * @returns {Promise} - Promise that resolves when sagas are done
 */
export async function waitForSagas(store, showConsole = false) {
  const hrstart = process.hrtime();

  store.stopSagas();
  await store.rootSagaPromise;

  const hrend = process.hrtime(hrstart);
  showConsole && console.log("SSR: Sagas completed in %ds %dms", hrend[0], hrend[1] / 1000000);
}
