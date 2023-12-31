// SaveChatDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';

function SaveChatDialog({ dialogOpen, setDialogOpen, apiUrl, conversationId, onSave  }) {
  const [enteredName, setEnteredName] = useState('');

  const handleSaveChat = async () => {
    // Make an API call to save the current conversation
    try {
      const response = await fetch(`${apiUrl}/saveChat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId,
          name: enteredName,
        }),
      });


      if(response.ok) {
        setDialogOpen(false);
        setEnteredName('');
        if (typeof onSave === 'function') {
          onSave();
        }
      }
           
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setDialogOpen(false);
      setEnteredName('');

    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Save Chat</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for this conversation.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Conversation Name"
          fullWidth
          onChange={(event) => setEnteredName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveChat} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveChatDialog;
