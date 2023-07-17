import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Drawer, Typography, makeStyles, Tooltip } from '@material-ui/core';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: theme.spacing(1),
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  listItemText: {
    whiteSpace: 'nowrap',
  },
}));

function ChatHistory({ onSelectConversation, apiUrl, drawerOpen, setDrawerOpen }) {
  const classes = useStyles();
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [tooltipTitle, setTooltipTitle] = useState('');

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
      } catch (error) {
        setError(error);
      }
    };

    if (drawerOpen) {
      fetchConversations();
    }
  }, [apiUrl, drawerOpen]);

  const handleClick = (conversation) => {
    onSelectConversation(conversation.conversationId);
  };

  const handleMouseEnter = (e, name) => {
    const target = e.target;

    if (target.offsetWidth < target.scrollWidth) {
      setTooltipTitle(name);
    } else {
      setTooltipTitle('');
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
      >
        <List component="nav" aria-label="main mailbox folders">
          {conversations.map((conversation) => (
            <ListItem 
              button 
              onClick={() => handleClick(conversation)} 
              key={conversation.conversationId}
            >
              <Tooltip title={tooltipTitle} placement="right">
                <ListItemText
                  className={classes.listItemText}
                  primary={
                    <Typography noWrap onMouseEnter={(e) => handleMouseEnter(e, conversation.name)}>
                      {conversation.name}
                    </Typography>
                  }
                />
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }
}

export default ChatHistory;
