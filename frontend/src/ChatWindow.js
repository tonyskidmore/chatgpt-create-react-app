import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Message from './Message';

const useStyles = makeStyles(theme => ({
  chatWindow: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function ChatWindow({ messages, chatWindowRef }) {
  const classes = useStyles();

  return (
    <Box ref={chatWindowRef} className={classes.chatWindow}>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </Box>
  );
}

export default ChatWindow;
