import React from 'react';
import { Box, TextField, IconButton, InputLabel, Tooltip, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  inputArea: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    flexWrap: 'wrap',
  },
  inputField: {
    flex: 1,
    marginRight: theme.spacing(2),
    maxWidth: '80%',
  },
}));

function ChatInput({ input, setInput, handleSendMessage, conversationId, messages,  }) {
  const classes = useStyles();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input !== '') {
        handleSendMessage(input, messages, conversationId);
        setInput('');
      }
    }
  };

  return (
    <Box className={classes.inputArea}>
      <InputLabel htmlFor="user-input"></InputLabel>
      <TextField
        id="user-input"
        className={classes.inputField}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message"
        multiline
      />
      <Tooltip title="Send">
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default ChatInput;
