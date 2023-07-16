import React from 'react';
import { Paper, InputLabel, makeStyles } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// useStyles removed for brevity...

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  chatWindow: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  userLabel: {
    color: '#ffffff',
  },
  agentLabel: {
    color: theme.palette.primary.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  userMessage: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    alignSelf: 'flex-end',
    // height: '10%'
    padding: theme.spacing(0)
  },
  chatGptMessage: {
    backgroundColor: '#ffffff',
    color: '#000000',
    alignSelf: 'flex-end',
  },
  inputArea: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  inputField: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  close: {
    padding: theme.spacing(0.5),
  },
  title: {
    flexGrow: 1,
  },
  clearButton: {
    marginLeft: theme.spacing(1),
  },
  message: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    // alignItems: 'center',
  },
  messageLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  userMessageContainer: {
    alignItems: 'center',
  },
  agentMessageContainer: {
      alignItems: 'baseline',
  },
}));

function Message({ message }) {
  const classes = useStyles();

  return (
    <Paper
    className={`${classes.message} ${message.sender === 'user' ? `${classes.userMessage} ${classes.userMessageContainer}` : `${classes.chatGptMessage} ${classes.agentMessageContainer}`}`} >
      <InputLabel className={classes.messageLabel} classes={{root: message.sender === 'user' ? classes.userLabel : classes.agentLabel}}>
        {message.sender === 'user' ? 'User:' : 'AI:'}
      </InputLabel>
      <ReactMarkdown className={message.sender === 'user' ? classes.userMessage : "markdown-body"} remarkPlugins={[remarkGfm]} children={message.text} />
    </Paper>
  );
}

export default Message;
