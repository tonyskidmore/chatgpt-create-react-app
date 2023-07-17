import React, { useState } from 'react';
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


function ChatInput({ handleSendMessage, conversationId, messages }) {
  const classes = useStyles();
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim() !== '') {
      handleSendMessage(input, messages, conversationId);
      setInput('');
    }
  };

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (input.trim() !== '') {
        console.log(`ChatInput messages: ${JSON.stringify(messages)}`);
        handleSendMessage(input, messages, conversationId);
        setInput('');
      }
    }}>
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
    </form>
  );
}

export default ChatInput;
