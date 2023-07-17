import React from 'react';
import { Box, Paper, makeStyles } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  userMessage: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    padding: theme.spacing(1),
  },
  chatGptMessage: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: theme.spacing(1),
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1),
  },
  markdownBody: {
    flexGrow: 1,
    display: 'inline-block',
  },
}));

function Message({ message }) {
  const classes = useStyles();

  return (
    <Paper className={`${message.sender === 'user' ? classes.userMessage : classes.chatGptMessage}`}>
      <Box className={classes.messageContainer}> 
        <ReactMarkdown className={classes.markdownBody} remarkPlugins={[remarkGfm]} 
          children={(message.sender === 'user' ? '**User:** ' : '**Agent:**  \n') + message.text} 
        />
      </Box>
    </Paper>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
