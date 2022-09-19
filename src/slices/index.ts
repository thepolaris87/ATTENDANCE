import { combineReducers } from 'redux';

import user from './user';
import main from './main';
import manager from './manager';

const rootReducer = combineReducers({ user, main, manager });

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
