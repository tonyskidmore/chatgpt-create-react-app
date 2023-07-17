// ChatHistory.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Drawer, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: '250px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '250px',
    backgroundColor: '#f5f5f5'
  }
}));

// , fetchFlag
function ChatHistory({ onSelectConversation, apiUrl, drawerOpen, setDrawerOpen }) {
  const classes = useStyles();
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);

  // console.log(`ChatHistory - fetchFlag: ${fetchFlag}`);
  console.log(`ChatHistory - drawerOpen: ${drawerOpen}`);
  console.log(`ChatHistory - apiUrl: ${apiUrl}`);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${apiUrl}/conversations`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const conversationsArray = Object.entries(data.conversations).map(([conversationId, name]) => ({ conversationId, name }));

        setConversations(conversationsArray);
        console.log(`ChatHistory - conversationsArray: ${JSON.stringify(conversationsArray)}`);
      } catch (error) {
        setError(error);
      }
    };

    if (drawerOpen) {
      fetchConversations();
    }
    }, [apiUrl, drawerOpen]);
    // , fetchFlag

  const handleClick = (conversation) => {
    onSelectConversation(conversation.conversationId);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      // conversations.length > 0 && (
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)}>
          <List component="nav" aria-label="main mailbox folders">
            {conversations.map((conversation) => (
              <ListItem button onClick={() => handleClick(conversation)} key={conversation.conversationId}>
                <ListItemText primary={conversation.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      // )
    );
  }
}

export default ChatHistory;
// export default React.memo(ChatHistory);
