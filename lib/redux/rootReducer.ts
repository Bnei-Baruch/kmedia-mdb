/* Instruments */
import {
    assetSlice,
    authSlice,
    filterSlice,
    filterStats,
    homeSlice,
    imageSlice,
    listSlice,
    mdbSlice,
    mySlice,
    playerSlice,
    playlistSlice,
    preparePageSlice,
    publicationsSlice,
    settingsSlice,
    sourcesSlice,
    tagsSlice,
    textFileSlice,
    trimSlice
} from './slices'
import {myNotesSlice} from "@/lib/redux/slices/mySlice/myNotesSlice";
import {simpleModeSlice} from "@/lib/redux/slices/simpleMode/simpleModeSlice";
import {musicSlice} from "@/lib/redux/slices/musicSlice/musicSlice";
import {searchSlice} from "@/lib/redux/slices/searchSlice";

export const reducer = {
    [homeSlice.homeSlice.name]: homeSlice.homeSlice.reducer,
    [publicationsSlice.publicationsSlice.name]: publicationsSlice.publicationsSlice.reducer,
    [settingsSlice.settingsSlice.name]: settingsSlice.settingsSlice.reducer,
    [authSlice.authSlice.name]: authSlice.authSlice.reducer,
    [mdbSlice.mdbSlice.name]: mdbSlice.mdbSlice.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [sourcesSlice.sourcesSlice.name]: sourcesSlice.sourcesSlice.reducer,
    [imageSlice.imageSlice.name]: imageSlice.imageSlice.reducer,
    [trimSlice.trimSlice.name]: trimSlice.trimSlice.reducer,
    [filterSlice.filterSlice.name]: filterSlice.filterSlice.reducer,
    [listSlice.listSlice.name]: listSlice.listSlice.reducer,
    [filterStats.filterStats.name]: filterStats.filterStats.reducer,
    [tagsSlice.tagsSlice.name]: tagsSlice.tagsSlice.reducer,
    [mySlice.mySlice.name]: mySlice.mySlice.reducer,
    [myNotesSlice.name]: myNotesSlice.reducer,
    [preparePageSlice.preparePageSlice.name]: preparePageSlice.preparePageSlice.reducer,
    [playlistSlice.playlistSlice.name]: playlistSlice.playlistSlice.reducer,
    [playerSlice.playerSlice.name]: playerSlice.playerSlice.reducer,
    [assetSlice.assetSlice.name]: assetSlice.assetSlice.reducer,
    [textFileSlice.textFileSlice.name]: textFileSlice.textFileSlice.reducer,
    [simpleModeSlice.name]: simpleModeSlice.reducer,
    [musicSlice.name]: musicSlice.reducer,
}