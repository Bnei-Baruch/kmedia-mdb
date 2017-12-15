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
    let { items, wip, errors } = state;

    switch (action.type){
        case FETCH_ASSET:
            wip = true;
            errors = null;
            items = [];
            break;

        case FETCH_ASSET_SUCCESS:
            wip = false;
            errors = null;
            items = action.payload;
            break;
 
        case FETCH_ASSET_FAILURE:
            wip = false;
            errors = action.payload;
            items = [];
            break;

        default:
            break;
    }

    return {
        ...state,
        wip,
        errors,
        items
    }
};

export const reducer = handleActions({
    [FETCH_ASSET]: setStatus,
    [FETCH_ASSET_SUCCESS]: setStatus,
    [FETCH_ASSET_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getItems          = state => state.items;
const getWip            = state => state.wip; 
const getErrors         = state => state.errors;

export const selectors = {
    getItems,
    getWip,
    getErrors,
};
