// src/redux/store/store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import studentSlice from '../slices/studentSlice';
import teacherSlice from '../slices/teacherSlice';

const studentPersistConfig = {
  key: 'student',
  storage,
    // whitelist: ['id', 'name'], // only store these
  // blacklist: ['avatarUrl'] // or exclude specific ones
};

const teacherPersistConfig = {
  key: 'teacher',
  storage,
};

const rootReducer = combineReducers({
  studentAuth: persistReducer(studentPersistConfig, studentSlice.reducer),
  teacherAuth: persistReducer(teacherPersistConfig, teacherSlice.reducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
