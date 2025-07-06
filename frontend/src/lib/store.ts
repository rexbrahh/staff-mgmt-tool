import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import taskReducer from './features/tasks/taskSlice';
import teamReducer from './features/team/teamSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: taskReducer,
      team: teamReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];