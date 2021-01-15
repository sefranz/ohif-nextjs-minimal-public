import { combineReducers } from 'redux';

import OHIF from '@ohif/core';

import metaReducer from './reducers/meta-reducer';

const { reducers: OHIFReducers } = OHIF.redux;

const appReducer = combineReducers({
  meta: metaReducer,
  ...OHIFReducers,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
