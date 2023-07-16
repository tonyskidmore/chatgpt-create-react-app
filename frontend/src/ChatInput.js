import React from 'react';
import { Box, TextField, IconButton, InputLabel, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  inputArea: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  inputField: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
}));

function ChatInput({ input, setInput, handleSendMessage, conversationId, messages,  }) {
  const classes = useStyles();

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (input !== '') {
        console.log(`ChatInput messages: ${JSON.stringify(messages)}`);
        handleSendMessage(input, messages, conversationId);
      }
    }}>
      <Box className={classes.inputArea}>
        <InputLabel htmlFor="user-input"></InputLabel>
        <TextField
          id="user-input"
          className={classes.inputField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
        />
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      </Box>
    </form>
  );
}

export default ChatInput;
