import {reducer as search} from "./slices/searchSlice/searchSlice"
/* Instruments */
import {
    authSlice,
    homeSlice,
    mdbSlice,
    publicationsSlice,
    settingsSlice,
    sourcesSlice,
    imageSlice,
    trimSlice
} from './slices'

export const reducer = {
    [homeSlice.homeSlice.name]: homeSlice.homeSlice.reducer,
    [publicationsSlice.publicationsSlice.name]: publicationsSlice.publicationsSlice.reducer,
    [settingsSlice.settingsSlice.name]: settingsSlice.settingsSlice.reducer,
    [authSlice.authSlice.name]: authSlice.authSlice.reducer,
    [mdbSlice.mdbSlice.name]: mdbSlice.mdbSlice.reducer,
    search,
    [sourcesSlice.sourcesSlice.name]: sourcesSlice.sourcesSlice.reducer,
    [imageSlice.imageSlice.name]: imageSlice.imageSlice.reducer,
    [trimSlice.trimSlice.name]: trimSlice.trimSlice.reducer,
}
