import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { LinearProgress, makeStyles } from '@material-ui/core';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ChatAppBar from './ChatAppBar';
import AlertSnackbar from './AlertSnackbar';
import { handleSendMessage } from './ChatLogic';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './ChatHistory';
import SaveChatDialog from './SaveChatDialog';

const WELCOME_MESSAGE = "Welcome to the chat! Type a message and hit 'Enter' to send.";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  }
}));


function App() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(uuidv4());
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);
  const [open, setOpen] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [fetchFlag, setFetchFlag] = useState(false);
  const [, setDisplayDrawer] = useState(false);
  // const [reloadChatHistory, setReloadChatHistory] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL === undefined ? window.REACT_APP_API_URL : process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log(`REACT_APP_API_URL: ${apiUrl}`);
  }, [apiUrl]);

  const sendUserMessage = async (userMessage, messages, conversationId) => {
    setIsRetrying(true);
    console.log(`App sendUserMessage messages: ${JSON.stringify(messages)}`);
    console.log(`App sendUserMessage conversationId: ${conversationId}`);
    const isStillRetrying = await handleSendMessage(userMessage, setMessages, setAlert, setInput, apiUrl, messages, conversationId);
    setIsRetrying(isStillRetrying);
  };

  const fetchConversationHistory = async (conversationId) => {
    const response = await fetch(`${apiUrl}/conversations/${conversationId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data.messages;
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      const messages = await fetchConversationHistory(conversationId);
      setMessages(messages);
      setConversationId(conversationId);
      setDrawerOpen(false);
    } catch (error) {
      console.error(`Failed to fetch conversation history: ${error}`);
    }
  };

  const onClearChat = () => {
    // clear the chat messages
    setMessages([]);
    // clear the user input
    setInput('');
    // generate a new UUID for the conversation
    const newConversationId = uuidv4();
    setConversationId(newConversationId);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box className={classes.root}>
      <ChatAppBar 
        onClearChat={onClearChat}
        onSaveChat={() => setDialogOpen(true)} 
        onShowHistory={() => setDrawerOpen(true)} 
      />
      <AlertSnackbar 
        open={open}
        handleClose={handleClose}
        message={WELCOME_MESSAGE} 
      />
      <AlertSnackbar 
        open={alert.open}
        handleClose={() => setAlert({ open: false, message: '' })} 
        message={alert.message} 
        error
      />
      <ChatWindow 
        messages={messages} 
        chatWindowRef={chatWindowRef} 
      />
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={sendUserMessage}
        messages={messages}
        conversationId={conversationId}
      />
      <ChatHistory 
        onSelectConversation={handleSelectConversation} 
        apiUrl={apiUrl} 
        drawerOpen={drawerOpen} 
        setDrawerOpen={setDrawerOpen}
        classes={classes}
        // fetchFlag={fetchFlag}
      />
      <SaveChatDialog 
        dialogOpen={dialogOpen} 
        setDialogOpen={setDialogOpen} 
        apiUrl={apiUrl}
        conversationId={conversationId}
        onSave={() => {
          // setFetchFlag((prev) => !prev);
          setDisplayDrawer(true);
        }}
      />
      {/* <SaveChatDialog 
        dialogOpen={dialogOpen} 
        setDialogOpen={setDialogOpen} 
        apiUrl={apiUrl}
        conversationId={conversationId}
        onSave={() => {
          setFetchFlag(prev => !prev);
          // setDrawerOpen(true);
        }}
        // fetchFlag={fetchFlag}
        // setFetchFlag={setFetchFlag}
      /> */}
      {isRetrying && <LinearProgress />}
    </Box>
  );
}

export default App;
