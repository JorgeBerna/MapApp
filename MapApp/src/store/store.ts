import { configureStore } from '@reduxjs/toolkit';
import userCountriesReducer from './slices/userCountriesSlice';

const store = configureStore({
  reducer: {
    userCountries: userCountriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;