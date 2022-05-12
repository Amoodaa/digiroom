import { SnackbarKey, OptionsObject, SnackbarMessage } from 'notistack';

export type SnackObject = {
  key: SnackbarKey;
  dismissed: boolean;
  message: SnackbarMessage;
  options: OptionsObject;
};

export type SnackObjectAction = {
  key?: SnackbarKey;
  message: SnackbarMessage;
  options?: {
    /**
     * Unique identifier to reference a snackbar.
     * @default random unique string
     */
    key?: SnackbarKey;
    /**
     * Snackbar stays on the screen, unless it is dismissed (programmatically or through user interaction).
     * @default false
     */
    persist?: boolean;
  };
  dismissed?: false;
};

/* --- STATE --- */
export interface SnackbarState {
  snacks: Record<SnackbarKey, SnackObject>;
}

export type ContainerState = SnackbarState;
