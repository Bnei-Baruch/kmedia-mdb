# Server-Side Rendering (SSR) Architecture

This directory contains the refactored, modular SSR implementation for the kmedia-mdb application.

## Structure

The SSR system is organized into focused, single-responsibility modules:

### Core Modules

#### `renderer.js`
Main SSR orchestrator that coordinates the entire server-side rendering process. This is the entry point for SSR requests.

**Key responsibilities:**
- Request routing (authenticated vs SSO auth)
- Orchestrating the SSR pipeline
- Error handling

#### `bot-detection.js`
Utilities for detecting bots and crawlers.

**Exports:**
- `isBot(req)` - Checks if request is from a bot/crawler
- `shouldTreatAsBot(req)` - Checks if request should be treated as a bot (includes embed parameter)

#### `language-handler.js`
Language detection, validation, and routing logic.

**Exports:**
- `extractUILanguage(req)` - Extracts and validates UI language from request
- `extractCookieLanguages(req, defaultUILang)` - Extracts language preferences from cookies
- `getMomentLocale(uiLang)` - Gets appropriate moment locale for UI language

#### `seo-helpers.js`
SEO meta tag generation for search engine optimization.

**Exports:**
- `canonicalLink(req, lang)` - Generates canonical link tag
- `alternateLinks(req, lang)` - Generates alternate language links
- `ogUrl(req, lang)` - Generates Open Graph URL meta tag
- `generateSEOTags(req, lang)` - Generates all SEO tags at once

#### `html-builder.js`
HTML template building and manipulation.

**Exports:**
- `buildRootDiv(markup, storeData, i18n, direction)` - Builds root div with SSR content
- `buildSSRHtml(htmlTemplate, options)` - Builds complete SSR HTML
- `buildSSOAuthHtml(htmlTemplate)` - Builds minimal HTML for SSO auth flow

#### `data-loader.js`
Coordinates SSR data loading from routes and sagas.

**Exports:**
- `loadSSRData(options)` - Loads all SSR data for the current route
- `waitForSagas(store, showConsole)` - Waits for Redux sagas to complete

#### `store-initializer.js`
Redux store initialization for SSR.

**Exports:**
- `initializeStore(options)` - Initializes Redux store with SSR data
- `getDeviceInfo(req)` - Gets device info from user agent

## SSR Data Loaders

The SSR data loaders have been refactored into domain-specific files in `src/route/ssrData/`:

- **`home-loaders.js`** - Home page SSR loaders
- **`unit-loaders.js`** - Content unit and playlist SSR loaders
- **`lessons-loaders.js`** - Lessons page SSR loaders
- **`events-loaders.js`** - Events page SSR loaders
- **`programs-loaders.js`** - Programs page SSR loaders
- **`publications-loaders.js`** - Publications, articles, blog SSR loaders
- **`sources-loaders.js`** - Library/sources page SSR loaders
- **`topics-loaders.js`** - Topics page SSR loaders
- **`search-loaders.js`** - Search page SSR loaders
- **`music-loaders.js`** - Music page SSR loaders
- **`simple-mode-loaders.js`** - Simple mode SSR loaders
- **`about-loaders.js`** - About page SSR loaders
- **`list-loaders.js`** - Generic list page SSR loaders
- **`index.js`** - Main export file

## Request Flow

```
1. Client Request
   ↓
2. renderer.js (Main Entry Point)
   ↓
3. language-handler.js (Extract & Validate Language)
   ↓
4. bot-detection.js (Check if Bot)
   ↓
5. Decision: Authenticated/Bot vs SSO Auth
   ↓
6a. SSO Auth Flow                    6b. Authenticated/Bot Flow
    ↓                                     ↓
    html-builder.buildSSOAuthHtml         store-initializer.initializeStore
                                          ↓
                                          data-loader.loadSSRData
                                          ↓
                                          Route SSR Loaders (src/route/ssrData/)
                                          ↓
                                          data-loader.waitForSagas
                                          ↓
                                          ReactDOMServer.renderToString
                                          ↓
                                          seo-helpers.generateSEOTags
                                          ↓
                                          html-builder.buildSSRHtml
   ↓                                     ↓
7. Send Response to Client
```

## Benefits of Refactored Architecture

### 1. **Single Responsibility Principle**
Each module has one clear purpose, making code easier to understand and maintain.

### 2. **Testability**
Smaller, focused modules are much easier to unit test in isolation.

### 3. **Reusability**
Utility functions can be reused across different parts of the application.

### 4. **Maintainability**
Changes to one aspect of SSR (e.g., SEO tags) only require modifications to one module.

### 5. **Readability**
The main renderer.js file is now much cleaner and easier to follow.

### 6. **Domain Organization**
SSR data loaders are organized by domain/feature, making it easy to find relevant code.

## Migration from Old Structure

The old monolithic files have been deprecated:
- `server/renderer.js` → `server/ssr/renderer.js` (and other modules)
- `src/route/routesSSRData.js` → `src/route/ssrData/` (directory with domain-specific files)

Backward compatibility files are provided but will be removed in a future version.

## Debugging

To enable SSR debugging, add `ssr_debug` to the URL query parameters:
```
http://example.com/en/lessons?ssr_debug
```

This will output detailed timing and execution information to the server console.

## Adding New SSR Routes

1. Create an SSR data loader function in the appropriate domain file in `src/route/ssrData/`
2. Export it from `src/route/ssrData/index.js`
3. Reference it in your route definition in `src/route/routes.js`

Example:
```javascript
// In src/route/ssrData/my-feature-loaders.js
export const myFeaturePage = async (store, match) => {
  // Your SSR data loading logic
  await store.sagaMiddleWare.run(...).done;
  return Promise.resolve();
};

// In src/route/ssrData/index.js
export { myFeaturePage } from './my-feature-loaders';

// In src/route/routes.js
{ path: 'my-feature', component: <MyFeature/>, ssrData: ssrDataLoaders.myFeaturePage }
```

