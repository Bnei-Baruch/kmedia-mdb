import { createAction, handleActions } from 'redux-actions';

const FETCH_ASSET                     = 'Assets/FETCH_ASSET';
const FETCH_ASSET_SUCCESS             = 'Assets/FETCH_ASSET_SUCCESS';
const FETCH_ASSET_FAILURE             = 'Assets/FETCH_ASSET_FAILURE';

export const types = {
    FETCH_ASSET,
    FETCH_ASSET_SUCCESS,
    FETCH_ASSET_FAILURE,
};

/* Actions */

const fetchAsset            = createAction(FETCH_ASSET);
const fetchAssetSuccess     = createAction(FETCH_ASSET_SUCCESS);
const fetchAssetFailure     = createAction(FETCH_ASSET_FAILURE);

export const actions = {
    fetchAsset,
    fetchAssetSuccess,
    fetchAssetFailure,
};

/* Reducer */

const initialState = {
    items: [],
    wip: false,
    errors: null,
};

//set wip & errors
const setStatus = (state, action) => {
    const wip    = { ...state.wip };
    const errors = { ...state.errors };

    switch (action.type){
        case FETCH_ASSET:
            wip: true;
            errors: null;
            break;

        case FETCH_ASSET_SUCCESS:
            wip: false;
            errors: null;
            break;

        case FETCH_ASSET_FAILURE:
            wip: false;
            errors: action.payload;
            break;

        default:
            break;
    }

    return {
        ...state,
        wip,
        errors,
    }
};

export const reducer = handleActions({
    [FETCH_ASSET]: setStatus,
    [FETCH_ASSET_SUCCESS]: setStatus,
    [FETCH_ASSET_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getImages = state => state.items;

export const selectors = {
    getImages,
};
