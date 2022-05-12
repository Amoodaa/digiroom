/**
 *
 * Snackbar
 *
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar, SnackbarKey } from 'notistack';
import { selectSnacks } from 'slices/snackbar/selectors';
import { snackbarActions } from 'slices/snackbar/slice';

let displayed: SnackbarKey[] = [];

export const Snackbars: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectSnacks);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  React.useEffect(() => {
    Object.values(notifications).forEach(({ key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) return;

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          dispatch(snackbarActions.removeSnackbar(myKey));
          removeDisplayed(myKey);
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};
