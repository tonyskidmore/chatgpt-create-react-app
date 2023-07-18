import React from 'react';
import { Snackbar, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
}));

function AlertSnackbar({ open, handleClose, message, error }) {
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: error ? 'right' : 'center',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      ContentProps={{
        classes: {
          root: error ? classes.error : undefined,
        }
      }}
    />
  );
}

export default AlertSnackbar;
