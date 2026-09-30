import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { moduleApi } from './moduleApi';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { lessonApi } from './LessionApi';
import { quizApi } from './quizApi';
import { blogApi } from './blogApi';
import { mentorshipApi } from "./mentorshipApi";


// Redux Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lms_auth'],
};

// Combine reducers
const rootReducer = combineReducers({
  lms_auth: authReducer,
  [moduleApi.reducerPath]: moduleApi.reducer,
  [lessonApi.reducerPath]: lessonApi.reducer,
  [quizApi.reducerPath]: quizApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [mentorshipApi.reducerPath]: mentorshipApi.reducer,
  

});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(moduleApi.middleware, 
      lessonApi.middleware, 
      quizApi.middleware,
      blogApi.middleware,
      mentorshipApi.middleware
 
    ),
});

export const persistor = persistStore(store);
export default store;
