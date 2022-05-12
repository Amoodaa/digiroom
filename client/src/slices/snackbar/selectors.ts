import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const selectDomain = (state: RootState) => state.snackbar;

export const selectSnacks = createSelector([selectDomain], snackbarState => snackbarState.snacks);
