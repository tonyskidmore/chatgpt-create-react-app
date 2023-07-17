// ChatAppBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  clearButton: {
    marginLeft: theme.spacing(1),
  },
  saveButton: {
    marginLeft: theme.spacing(1),
  },
}));

function ChatAppBar({ onClearChat, onSaveChat, onShowHistory }) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          ChatGPT App
        </Typography>
        <Button color="inherit" className={classes.clearButton} onClick={onClearChat}>
          Clear Chat
        </Button>
        <Button color="inherit" className={classes.clearButton} onClick={onSaveChat}>
          Save Chat
        </Button>
        <Button color="inherit" className={classes.clearButton} onClick={onShowHistory}>
          Show Chat History
        </Button>
      </Toolbar>
    </AppBar>
  );
}


export default ChatAppBar;
